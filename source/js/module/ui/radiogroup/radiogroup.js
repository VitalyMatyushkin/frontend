const 	React 		= require('react'),
		ReactDOM 	= require('react-dom'),
		Immutable 	= require('immutable'),
		Morearty    = require('morearty'),
		{If}		= require('module/ui/if/if');

const RadioGroup = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		sourcePromise:	React.PropTypes.func,
		onSelect:		React.PropTypes.func,
		sourceArray:	React.PropTypes.array,
		name:			React.PropTypes.string,
		id:				React.PropTypes.string
	},
	getDefaultState: function () {
		this.responseData = [];

		return Immutable.fromJS({
			selectedId: null,
			selectedValue: null,
			defaultId: null,
			showList: false
		});
	},
	setDefaultId: function() {
		const 	binding		= this.getDefaultBinding(),
				defaultId	= binding.get('defaultId');

		//Using default binding because it renders appropriately
		if (defaultId) {
			binding.get('responseData').forEach( dataBlock => {
				dataBlock.id === defaultId && this.handleSelect(defaultId);
			});
		}
	},
	componentWillMount: function () {
		const binding = this.getDefaultBinding();

		// На случай, если форма заполняется асинхронно
		binding.addListener('defaultId', () => {
			this.setDefaultId();
		});

		if (this.props.sourcePromise) {
			this.props.sourcePromise().then( dataArray => {
				binding.set('responseData', dataArray);
				this.setDefaultId();
			});
		} else {
			binding.set('responseData', this.props.sourceArray);
			this.setDefaultId();
		}
	},
	handleSelect: function (newId) {
		const	binding	= this.getDefaultBinding(),
				model	= binding.get('responseData').filter( data => data.id === newId )[0];

		if (this.props.onSelect) {
			this.props.onSelect(newId, model.value);
		}

		binding.atomically()
			.set('selectedId', newId)
			.set('selectedValue', model.value)
			.commit();
	},
	renderRadioOptions: function () {
		const	binding		= this.getDefaultBinding(),
				selectedId	= binding.get('selectedId'),
				htmlId		= this.props.id;

		if(binding.get('responseData')){
			return binding.get('responseData').map( (dataBlock, index) => {
				const inputHtmlId = htmlId ? htmlId + index : undefined;
				return (
					<label key={index} onClick={() => { this.handleSelect(dataBlock.id); }} className="eRadioGroupMy_label">
						<input checked={selectedId===dataBlock.id}  type="radio" value={dataBlock.id} id={inputHtmlId}/>
						{dataBlock.value}
					</label>
				);
			});
		}
	},
	render: function () {
		const radioNodes = this.renderRadioOptions();

		return (
			<div className="bRadioGroupMy" id={this.props.id}>
				<If condition={this.props.name !== undefined}>
					<label className="eRadioGroupMy_label">{this.props.name}</label>
				</If>
				{radioNodes}
			</div>
		);
	}
});

module.exports = RadioGroup;


