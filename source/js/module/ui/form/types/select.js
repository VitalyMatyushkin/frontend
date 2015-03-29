var TypeMixin = require('module/ui/form/types/type_mixin'),
	Select = require('module/ui/select/select'),
	TypeSelect;

TypeSelect = React.createClass({
	mixins: [Morearty.Mixin, TypeMixin],
	propTypes: {
		sourcePromise: React.PropTypes.func
	},
	bindToAutcomplete: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			defaultValue = binding.get('defaultValue'),
			defaultLabel = binding.get('defaultLabel');

		if (defaultValue) {
			binding.sub('autocomplete').set('defaultId', defaultValue);
		}

		if (defaultLabel) {
			binding.sub('autocomplete').set('defaultLabel', defaultLabel);
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
			<Select sourcePromise={self.props.sourcePromise}  binding={self.getDefaultBinding().sub('select')} />
		);
	}
});

module.exports = TypeSelect;
