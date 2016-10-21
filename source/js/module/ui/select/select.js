const 	ComboboxOption 			= require('./option'),
		React 					= require('react'),
		Immutable 				= require('immutable'),
		Morearty				= require('morearty'),
		Lazy					= require('lazy.js'),

		If						= require('./../if/if');

/** Component which acts like selects and display array of data passed as sourceArray property */
const Select = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		/** function to call when option selected. (item.id, item.value) */
        onSelect: 		React.PropTypes.func,
		/** array of data to display. Each item should have id and value properties */
		sourceArray: 	React.PropTypes.array,
		isDisabled:		React.PropTypes.bool, //false - show field like disabled
		placeHolder:	React.PropTypes.string
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			selectedId: 	null,
			selectedValue: 	null,
			defaultId: 		null,
			showList: 		false
		});
	},

	/** show/hide option list */
	toggleList: function() {
		const 	binding 	= this.getDefaultBinding(),
				showList 	= !(binding.get('showList') || false);

		// toggle list only when component has prop isDisable === false
		if(!(!!this.props.isDisabled)) {
			binding.set('showList', showList);
		}
	},


	setDefaultId: function() {
		const 	self 		= this,
				binding 	= self.getDefaultBinding(),
				defaultId 	= binding.get('defaultId');

		if (defaultId) {
			this.handleSelect(defaultId);
		}
	},
	componentWillMount: function () {
		const 	self 		= this,
				binding 	= self.getDefaultBinding(),
				defaultId 	= binding.get('defaultId');

		// For the case when for filled async
		binding.addListener('defaultId', function() {
			self.setDefaultId();
		});

		self.setDefaultId();

	},
	/** should be fired on value selection.
	 * @param newId id property of selected element
     */
	handleSelect: function (newId) {
		const 	self 		= this,
				binding 	= self.getDefaultBinding(),
				model 		= Lazy(this.props.sourceArray).findWhere({ id: newId});

        if (self.props.onSelect) {
            self.props.onSelect(newId, model.value);
        }

		binding.atomically()
			.set('selectedId', newId)
			.set('selectedValue', model.value)
			.commit();

		binding.set('showList', false);
	},

	/** Will render list of options according to current component state */
	renderComboboxOptions: function () {
		const 	self 		= this,
				binding 	= self.getDefaultBinding(),
				selectedId 	= binding.get('selectedId');

		return this.props.sourceArray.map(item => {
			return (
				<ComboboxOption
					onClick		= {() => { self.handleSelect(item.id); }}
					isSelected	= { selectedId === item.id }
					key			= { item.id }
					value		= { item.id }>
					{item.value}
				</ComboboxOption>
			);
		});
	},
	getText: function() {
		return (
			this.getDefaultBinding().toJS('selectedValue') !== null ?
				this.getDefaultBinding().toJS('selectedValue') :
				this.props.placeHolder
		);
	},
	render: function () {
		const 	self 			= this,
				binding 		= self.getDefaultBinding(),
				dropDownNodes 	= self.renderComboboxOptions(),
				listStyle 		= {display: 'none'};

		if (binding.get('showList')) {
			listStyle.display = 'block';
		}

		// show button only when component has prop isDisable === false
		const isShowComboboxButton = !(!!this.props.isDisabled);

		return (
			<div className="bCombobox">
				<input value={this.getText()} onClick={self.toggleList} type="text" readOnly />
				<If condition={isShowComboboxButton}>
					<span onClick={self.toggleList} className="eCombobox_button"></span>
				</If>
				<div className="eCombobox_list" style={listStyle}>
					{dropDownNodes}
				</div>
			</div>
		);
	}
});

module.exports = Select;


