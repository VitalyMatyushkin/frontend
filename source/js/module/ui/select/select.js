const 	AutocompleteHelpers 	= require('module/ui/autocomplete/main'),
		ComboboxOption 			= AutocompleteHelpers.Option,
		React 					= require('react'),
		ReactDOM 				= require('reactDom'),
		Immutable 				= require('immutable');


const Autocomplete = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		sourcePromise: React.PropTypes.func,
        onSelect: React.PropTypes.func,
		sourceArray: React.PropTypes.array
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
	toggleList: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			showList = !(binding.get('showList') || false);

		binding.set('showList', showList);
	},
	setDefaultId: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			defaultId = binding.get('defaultId');

		if (defaultId) {
			self.responseData.forEach(function(dataBlock) {
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
				self.responseData = dataArray;
				self.setDefaultId();
			});
		} else {
			self.responseData = self.props.sourceArray;
			self.setDefaultId();
		}
	},
	handleSelect: function (newId) {
		var self = this,
			binding = self.getDefaultBinding(),
			model = self.responseData.filter(function (data) {
				return data.id === newId;
			})[0];

        if (self.props.onSelect) {
            self.props.onSelect(newId, model.value);
        }

		binding.atomically()
			.set('selectedId', newId)
			.set('selectedValue', model.value)
			.commit();

		binding.set('showList', false);
	},
	renderComboboxOptions: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			selectedId = binding.get('selectedId');

		return self.responseData.map(function (dataBlock) {

			return (
				<ComboboxOption onClick={function () { self.handleSelect(dataBlock.id); }} isSelected={selectedId===dataBlock.id} key={dataBlock.id} value={dataBlock.id}>{dataBlock.value}</ComboboxOption>
			);
		});
	},
	render: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			dropDownNodes = self.renderComboboxOptions(),
			listStyle = {display: 'none'};

		if (binding.get('showList')) {
			listStyle.display = 'block';
		}

		return (
			<div className="bCombobox">
				<input value={binding.get('selectedValue')} onClick={self.toggleList} type="text" readOnly />
				<span onClick={self.toggleList} className="eCombobox_button">▾</span>
				<div className="eCombobox_list" style={listStyle}>
					{dropDownNodes}
				</div>
			</div>
		);
	}
});

module.exports = Autocomplete;


