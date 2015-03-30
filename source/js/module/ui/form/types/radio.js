var TypeMixin = require('module/ui/form/types/type_mixin'),
	RadioGroup = require('module/ui/radiogroup/radiogroup'),
	TypeRadio;

TypeRadio = React.createClass({
	mixins: [Morearty.Mixin, TypeMixin],
	propTypes: {
		sourcePromise: React.PropTypes.func
	},
	bindToAutcomplete: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			defaultValue = binding.get('defaultValue');

		if (defaultValue) {
			binding.sub('radio').set('defaultId', defaultValue);
		}

		binding.sub('radio').addListener('selectedId', function() {
			var newSelectedId = binding.get('radio.selectedId');

			self.setValue(newSelectedId);
		});

	},
	render: function() {
		var self = this;

		self.bindToAutcomplete();

		return (
			<RadioGroup sourcePromise={self.props.sourcePromise} binding={self.getDefaultBinding().sub('radio')} />
		);
	}
});

module.exports = TypeRadio;
