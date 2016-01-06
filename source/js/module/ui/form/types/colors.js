var TypeMixin = require('module/ui/form/types/type_mixin'),
	ColorsSelect = require('module/ui/colors_select/colors_select'),
	React = require('react'),
	ReactDOM = require('reactDom'),
	TypeColors;

TypeColors =  React.createClass({
	propTypes: {
		maxColors: React.PropTypes.number
	},
	mixins: [Morearty.Mixin, TypeMixin],
	componentWillMount: function() {
		var self = this,
			binding = self.getDefaultBinding();

		binding.addListener('defaultValue', function() {
			self.setPickerColors(binding.get('defaultValue'));
		});

		binding.sub('colorPicker').addListener('colors', function() {
			var newColors = binding.sub('colorPicker.colors').toJS() || [];

			self.setValue(newColors);
		});
	},
	componentDidMount: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			defaultValue = binding.get('defaultValue');

		defaultValue && self.setPickerColors(defaultValue);
	},
	setPickerColors: function(colorsArray) {
		var self = this,
			binding = self.getDefaultBinding(),
			colorsArray = colorsArray || [];

		binding.sub('colorPicker.colors').set(Immutable.fromJS(colorsArray));
	},
	render: function () {
		var self = this;

		return (
			<div className="eForm_fieldInput">
				<ColorsSelect {...self.props} binding={self.getDefaultBinding().sub('colorPicker')} />
			</div>
		)
	}
});


module.exports = TypeColors;