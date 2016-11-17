const	React				= require('react'),

		RadioButtonStyle	= require('./../../../../styles/ui/radio_button/radio_button.scss');

const RadioButton = React.createClass({
	propTypes: {
		isChecked:	React.PropTypes.bool.isRequired,
		isDisabled:	React.PropTypes.bool,
		text:		React.PropTypes.array.isRequired,
		onClick:	React.PropTypes.func.isRequired,
		customCSS:	React.PropTypes.string
	},

	DEFAULT_CSS_STYLE: 'bRadioButton',

	getStyle: function() {
		if(typeof this.props.customCSS !== 'undefined') {
			return `${this.DEFAULT_CSS_STYLE} ${this.props.customCSS}`
		} else {
			return this.DEFAULT_CSS_STYLE;
		}
	},

	render: function() {
		return (
			<div className={ this.getStyle() }>
				<input	className	= "bRadioButton_input"
						type		= "radio"
						checked		= { this.props.isChecked }
						onChange	= { this.props.onClick }
						disabled	= { typeof this.props.isDisabled === "undefined" ? false : this.props.isDisabled }
				/>
				<div className="bRadioButton_text">
					{ this.props.text }
				</div>
			</div>
		);
	}
});

module.exports = RadioButton;