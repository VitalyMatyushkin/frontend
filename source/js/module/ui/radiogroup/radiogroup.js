const 	React 		= require('react'),
		ReactDOM 	= require('react-dom'),
		Immutable 	= require('immutable'),
		Morearty    = require('morearty'),
	{If}			= require('module/ui/if/if');

const RadioGroup = React.createClass({
	mixins: [Morearty.Mixin],
    displayName: 'RadioGroup',
	propTypes: {
		sourcePromise: React.PropTypes.func,
		onSelect: React.PropTypes.func,
		sourceArray: React.PropTypes.array,
		name: React.PropTypes.string,
		id: React.PropTypes.string
	},
	getDefaultState: function () {
		var self = this;

		self.responseData = [];

		return Immutable.fromJS({
			selectedId: null,
			selectedValue: null,
			defaultId: null,
			showList: false
		});
	},
	setDefaultId: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			defaultId = binding.get('defaultId');
		//Using default binding because it renders appropriately
		if (defaultId) {
			binding.get('responseData').forEach(function(dataBlock) {
				dataBlock.id === defaultId && self.handleSelect(defaultId);
			});
		}
	},
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			defaultId = binding.get('defaultId');

		// На случай, если форма заполняется асинхронно
		binding.addListener('defaultId', function() {
			self.setDefaultId();
		});

		if (self.props.sourcePromise) {
			self.props.sourcePromise().then(function(dataArray) {
				binding.set('responseData', dataArray);
				self.setDefaultId();
			});
		} else {
			binding.set('responseData', self.props.sourceArray);
			self.setDefaultId();
		}
	},
	handleSelect: function (newId) {
		var self = this,
			binding = self.getDefaultBinding(),
			model = binding.get('responseData').filter(function (data) {
				return data.id === newId;
			})[0];

		if (self.props.onSelect) {
			self.props.onSelect(newId, model.value);
		}

		binding.atomically()
			.set('selectedId', newId)
			.set('selectedValue', model.value)
			.commit();
	},
	renderRadioOptions: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			selectedId = binding.get('selectedId');
		if(binding.get('responseData')){
			return binding.get('responseData').map(function (dataBlock, index) {
				return (
					<label key={index} onClick={function () { self.handleSelect(dataBlock.id); }} className="eRadioGroupMy_label"><input checked={selectedId===dataBlock.id}  type="radio" value={dataBlock.id}/>{dataBlock.value}</label>
				);
			});
		}
	},
	render: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			radioNodes = self.renderRadioOptions();
		return (
			<div className="bRadioGroupMy" id={self.props.id}>
				<If condition={self.props.name !== undefined}>
					<label className="eRadioGroupMy_label">{self.props.name}</label>
				</If>
				{radioNodes}
			</div>
		);
	}
});

module.exports = RadioGroup;


