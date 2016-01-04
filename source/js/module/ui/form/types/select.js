var TypeMixin = require('module/ui/form/types/type_mixin'),
	Select = require('module/ui/select/select'),
	React = require('react'),
	ReactDOM = require('reactDom'),
	TypeSelect;

TypeSelect = React.createClass({
	mixins: [Morearty.Mixin, TypeMixin],
	propTypes: {
		sourcePromise: React.PropTypes.func
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
			<Select sourcePromise={self.props.sourcePromise}  binding={self.getDefaultBinding().sub('select')} />
		);
	}
});

module.exports = TypeSelect;
