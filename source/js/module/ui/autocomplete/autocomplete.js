var AutocompleteHelpers = require('module/ui/autocomplete/main'),
	Combobox = AutocompleteHelpers.Combobox,
	ComboboxOption = AutocompleteHelpers.Option,
	Autocomplete;


Autocomplete = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		serverField: React.PropTypes.string,
		serviceFunction: React.PropTypes.func
	},
	getDefaultState: function () {
		var self = this;

		self.responseData = [];

		return Immutable.fromJS({
			response: undefined,
			selectedId: 'a45a16ca-e02d-4d09-9613-fcd043a80f2c',
			defaultId: 'a45a16ca-e02d-4d09-9613-fcd043a80f2c'
		});
	},
	setDefaultValue: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			defaultId = binding.get('defaultId');

		if (defaultId) {
			self.handleInput(defaultId);
			self.handleSelect(defaultId);

		}
	},
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			defaultId = binding.get('defaultId');

		// На случай, если форма заполняется асинхронно
		binding.addListener('defaultId', function() {
			self.setDefaultValue();
		});

		self.updateFullData();
	},
	handleSelect: function (newId) {
		var self = this,
			binding = self.getDefaultBinding();

		binding.atomically().set('selectedId', newId).set('response', self.responseData).commit();
	},
	handleInput: function (userInput) {
		var self = this,
			binding = self.getDefaultBinding(),
			filter = new RegExp(userInput, 'i');

		binding.set('selectedId', null);

		if (userInput === '') {
			binding.set('response', []);
		} else {

			binding.set('response', self.responseData.filter(function (dataBlock) {
				var filterFiled = self.props.serverField || 'value';

				return filter.test(dataBlock[filterFiled]) || filter.test(dataBlock.id);
			}));
		}
	},
	updateFullData: function () {
		var self = this,
			binding = self.getDefaultBinding();

		self.pendingRequest && self.pendingRequest.abort();
		self.pendingRequest = window.Server.classes.get('056bef0f-494c-4f8a-9e07-27b842ce4045').then(function (data) {
			self.responseData = data;
			//binding.set('response', data);
			self.setDefaultValue();
		});
	},
	componentWillUnmount: function () {
		var self = this;

		self.pendingRequest && self.pendingRequest.abort();
	},
	renderComboboxOptions: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			dataToView = binding.get('response');

		return dataToView.map(function (dataBlock) {
			var filterFiled = self.props.serverField || 'value';

			return (
				<ComboboxOption key={dataBlock.id} value={dataBlock.id}>{dataBlock[filterFiled]}</ComboboxOption>
			);
		});
	},
	render: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			dataToView = binding.get('response'),
			selectedId = binding.get('selectedId'),
			dropDownNodes;

		if (dataToView && dataToView.length) {
			dropDownNodes = self.renderComboboxOptions();
		} else {
			dropDownNodes = <div style={{padding: '8px'}} aria-live="polite">No matches</div>
		}
		console.log(selectedId)
		return (
			<div>
				<Combobox onInput={self.handleInput} onSelect={self.handleSelect} value={selectedId}>
          		     {dropDownNodes}
				</Combobox>
			</div>
		);
	}
});

module.exports = Autocomplete;


