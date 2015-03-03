var TypeMixin = require('module/ui/form/types/input_mixin'),
	Autocomplete = require('module/ui/autocomplete/autocomplete'),
	TypeAutocompleteMixin,
	TypeAutocomplete;

TypeAutocompleteMixin = {
	propTypes: {
		serviceFullData: React.PropTypes.func.isRequired
	},
	componentWillMount: function() {
		var self = this,
			binding = self.getDefaultBinding();

		binding.update('autocomplete', function() {
			return Immutable.fromJS({
				response: undefined,
				selectedId: null,
				defaultId: null
			});
		});
	},
	setValue: function(value) {
		var self = this,
			binding = self.getDefaultBinding(),
			oldValue = binding.get('value');

		if (oldValue === value) {
			return false;
		}

		if (value) {
			self.hideError();
			binding.set('error', false);
			binding.set('value', value);
		}
	},
	bindToAutcomplete: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			defaultValue = binding.get('defaultValue');

		if (defaultValue) {
			binding.sub('autocomplete').set('defaultId', defaultValue);
		}

		binding.sub('autocomplete').addListener('selectedId', function() {
			var newSelectedId = binding.sub('autocomplete').get('selectedId');

			self.setValue(newSelectedId);
		});

	},
	render: function() {
		var self = this;

		self.bindToAutcomplete();

		return (
			<Autocomplete serviceFullData={self.props.serviceFullData} serverField="name" binding={self.getDefaultBinding().sub('autocomplete')} />
		);
	}
};

TypeAutocomplete = React.createClass({
	mixins: [Morearty.Mixin, $.extend({}, TypeMixin, TypeAutocompleteMixin)]
});

module.exports = TypeAutocomplete;
