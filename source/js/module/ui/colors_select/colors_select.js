var ColorPicker = require('module/ui/colors_select/color_picker'),
	ColorsSelect;

ColorsSelect =  React.createClass({
	propTypes: {
		maxColors: React.PropTypes.number
	},
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		return Immutable.fromJS({
			colors: [],
			showPicker: false,
			showAdd: false
		});
	},
	componentWillMount: function() {
		var self = this,
			binding = self.getDefaultBinding();

		self.activeHex = '#000000';
		self.calculateColorsCount();
	},
	componentDidMount: function() {
		var self = this;

		ColorPicker(self.refs.picker.getDOMNode(), function(hex, hsv, rgb) {
			self.activeHex = hex;
		});
	},
	calculateColorsCount: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			colors = binding.toJS('colors');

		if (colors.length >= self.props.maxColors) {
			self.hideAddButton();
		} else {
			self.showAddButton();
		}
	},
	removeColor: function(color) {
		var self = this,
			binding = self.getDefaultBinding(),
			colors = binding.toJS('colors'),
			colorIndex = colors.indexOf(color);

		colorIndex > -1 && colors.splice(colorIndex, 1);
		binding.set('colors', colors);
	},
	acceptColor: function() {
		var self = this,
			binding = self.getDefaultBinding();

		binding.update('colors', function (immutableValue) {
			return immutableValue.push(self.activeHex);
		});

		self.hidePicker();
		self.calculateColorsCount();
	},
	showAddButton: function() {
		var self = this,
			binding = self.getDefaultBinding();

		binding.set('showAdd', true);
	},
	hideAddButton: function() {
		var self = this,
			binding = self.getDefaultBinding();

		binding.set('showAdd', false);
	},
	showPicker: function() {
		var self = this,
			binding = self.getDefaultBinding();

		binding.set('showPicker', true);
	},
	hidePicker: function() {
		var self = this,
			binding = self.getDefaultBinding();

		binding.set('showPicker', false);
	},
	render: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			colors = binding.toJS('colors'),
			colorNodes;

		colorNodes = colors.map(function (color) {
			var removeColor = function() {
				self.removeColor(color);
			};

			return (
				<div className="eColorsSelect_color mRemovable" style={{background: color}} onClick={removeColor}></div>
			);
		});

		return (
			<div className="bColorsSelect">
				{colorNodes}

				<div className="eColorsSelect_color mAdd" style={binding.get('showAdd') ? {display: 'inline-block'}: {display: 'none'}}>
					<div className="eColorsSelect_addButton" onClick={self.showPicker}>+</div>


					<div className="eColorsSelect_picker" style={binding.get('showPicker') ? {display: 'block'}: {display: 'none'}} >

						<div className="eColorsSelect_plate" ref="picker"></div>

						<div className="eColorsSelect_buttons">
							<div className="bButton" onClick={self.hidePicker}>Cancel</div>
							<div className="bButton mRight" onClick={self.acceptColor}>Accept</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
});


module.exports = ColorsSelect;


