var AutocompleteHelpers = require('module/ui/autocomplete/main'),
	Combobox = AutocompleteHelpers.Combobox,
	ComboboxOption = AutocompleteHelpers.Option,
	Autocomplete;


Autocomplete = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		serverField: React.PropTypes.string,
		serviceFullData: React.PropTypes.func,
		serviceFilter: React.PropTypes.func,
		onSelect: React.PropTypes.func,
		onBlur: React.PropTypes.func,
		onInput: React.PropTypes.func,
		placeholderText: React.PropTypes.string,
		clearAfterSelect: React.PropTypes.bool
	},
	getDefaultState: function () {
		var self = this;

		self.responseData = [];

		return Immutable.fromJS({
			response: undefined,
			selectedId: null,
			defaultId: null
		});
	},
	setDefaultId: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			defaultId = binding.get('defaultId');

		if (defaultId) {
			self.responseData.forEach(function (dataBlock) {
				if (dataBlock.id === defaultId) {
					self.handleInput(dataBlock[self.props.serverField]);
					self.handleSelect(defaultId);
				}
			});
		}
	},
	setDefaultLabel: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			defaultLabel = binding.get('defaultLabel'),
			defaultId = binding.get('defaultId');

		if (defaultLabel && defaultId) {
			self.handleInput(defaultLabel);
			self.handleSelect(binding.get('defaultId'));
		}
	},
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			defaultId = binding.get('defaultId');

		// На случай, если форма заполняется асинхронно
		binding.addListener('defaultId', function () {
			self.setDefaultId();
		});

		binding.addListener('defaultLabel', function () {
			self.setDefaultLabel();
		});


		// Если передается сервис для получения полных данных, фильтруем на клиенте
		if (self.props.serviceFullData) {
			self.filterData = self._filterOnClient;
			self.updateFullData();
		} else {
			self.filterData = self._filterOnServer;
		}
	},
	handleInput: function (userInput) {
		var self = this,
			binding = self.getDefaultBinding();

		binding.set('selectedId', null);
		self.props.onInput && self.props.onInput(userInput);

		self.filterData && self.filterData(userInput);
	},
	handleSelect: function (newId) {
		var self = this,
			binding = self.getDefaultBinding(),
			model = self.responseData.filter(function (mod) {
				return mod.id === newId;
			});

		if (self.props.onSelect) {
			self.props.onSelect(newId, self.responseData, model.length > 0 ? model[0] : null);
		}

		binding.atomically()
			.set('selectedId', newId)
			.set('response', self.responseData)
			.set('model', model.length > 0 ? model[0] : null)
			.commit();
	},
	_filterOnServer: function (userInput) {
		var self = this,
			binding = self.getDefaultBinding();

		self.pendingRequest && self.pendingRequest.cancel();

		binding.set('loading', true);
		binding.set('response', null);

		self.pendingRequest = self.props.serviceFilter(userInput).then(function (data) {
			self.responseData = data;
			binding.set('response', data);
			binding.set('loading', false);
			self.forceUpdate();
		});
	},
	_filterOnClient: function (userInput) {
		var self = this,
			binding = self.getDefaultBinding(),
			filter = new RegExp(userInput, 'i');

		binding.set('response', self.responseData.filter(function (dataBlock) {
			var filterFiled = self.props.serverField || 'value';

			return filter.test(dataBlock[filterFiled]) || filter.test(dataBlock.id);
		}));
	},
	handleFocus: function () {
		var self = this,
			inputValue = self.getDefaultBinding().get('combobox.inputValue');

		//self.filterData(inputValue || '');
        self.filterData('');
	},
	updateFullData: function () {
		var self = this,
			binding = self.getDefaultBinding();

        self.pendingRequest && self.pendingRequest.cancel();

		self.pendingRequest = self.props.serviceFullData().then(function (data) {
			self.responseData = data;
			self.setDefaultId();
			self.forceUpdate();
		});
	},
	componentWillUnmount: function () {
		var self = this;

        self.pendingRequest && self.pendingRequest.cancel();
	},
	renderComboboxOptions: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			selectedId = binding.get('selectedId'),
			dataToView = binding.sub('response').toJS(),
			viewCount = dataToView.length,
			resultView = [];

		for (var i = 0; i < viewCount; i++) {
			(function(dataBlock) {
				var filterFiled = self.props.serverField || 'value';

				resultView.push(
					<ComboboxOption isSelected={selectedId === dataBlock.id} key={dataBlock.id} value={dataBlock.id}>{dataBlock[filterFiled]}</ComboboxOption>
				);
			})(dataToView[i]);
		}

		return resultView;
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
			dropDownNodes = <div style={{padding: '8px'}} aria-live="polite">{!binding.get('loading') ? 'No matches' : 'Loading...'}</div>
		}

		return (
			<div>
				<Combobox
					binding={binding.sub('combobox')}
					onInput={self.handleInput}
					onSelect={self.handleSelect}
					onFocus={self.handleFocus}
					clearAfterSelect={self.props.clearAfterSelect}
					placeholderText={self.props.placeholderText}
					value={selectedId}>{dropDownNodes}</Combobox>
			</div>
		);
	}
});

module.exports = Autocomplete;


