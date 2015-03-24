var TypeMixin = require('module/ui/form/types/type_mixin'),
	Autocomplete = require('module/ui/autocomplete/autocomplete'),
	TypeAutocompleteMixin,
	TypeAutocomplete;

TypeAutocompleteMixin = {
	propTypes: {
		serviceFullData: React.PropTypes.func,
		serviceFilter: React.PropTypes.func,
		serverField: React.PropTypes.string
	},
	bindToAutcomplete: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			defaultValue = binding.get('defaultValue');

		if (defaultValue) {
			binding.sub('autocomplete').set('defaultId', defaultValue);
			self.fullValidate(defaultValue);
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
			<Autocomplete onInput={self.changeValue} serviceFilter={self.props.serviceFilter} serviceFullData={self.props.serviceFullData} serverField={self.props.serverField || 'name'} binding={self.getDefaultBinding().sub('autocomplete')} />
		);
	}
};

TypeAutocomplete = React.createClass({
	mixins: [Morearty.Mixin, TypeMixin, TypeAutocompleteMixin]
});

module.exports = TypeAutocomplete;
