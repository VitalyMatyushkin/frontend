const 	TypeMixin 	= require('module/ui/form/types/type_mixin'),
		Select 		= require('module/ui/select/select'),
		React 		= require('react');

const TypeSelect = React.createClass({
	mixins: [Morearty.Mixin, TypeMixin],
	propTypes: {
		sourceArray:	React.PropTypes.array
	},
	bindToAutcomplete: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			defaultValue = binding.get('defaultValue');

		if (defaultValue) {
			binding.sub('select').set('defaultId', defaultValue);
		}

		binding.sub('select').addListener('selectedId', function() {
			var newSelectedId = binding.get('select.selectedId');

			self.setValue(newSelectedId);
		});

	},
	render: function() {
		var self = this;

		self.bindToAutcomplete();

		return (
			<Select sourceArray={self.props.sourceArray}  binding={self.getDefaultBinding().sub('select')} />
		);
	}
});

module.exports = TypeSelect;
