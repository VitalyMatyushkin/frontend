//@flow

const	React					= require('react'),

		RadioButtonCircle		= require('./radio_button_custom_circle'),
		RadioButtonLabel		= require('./radio_button_custom_label'),

		RadioButtonCustomStyle	= require('./../../../../styles/ui/radio_button_custom/radio_button_custom.scss');

/**
 * It's react js radiobutton. This component doesn't use html tag <input>.
 * Because this component has custom view. Ok, i know, this can be done by css.
 * But i think that is hard and dreary way.
 * Because you should use pseudo css class like :after :before and :checked :not(checked).
 * And you should hide standard html tag <input> and handle click only by label.
 * Also, we use awesomefont for our custom raddiobutton view - this creates additional problems.
 */
const RadioButtonCustom = React.createClass({
	propTypes: {
		isChecked:	React.PropTypes.bool.isRequired,
		isDisabled:	React.PropTypes.bool,
		onClick:	React.PropTypes.func.isRequired,
		text:		React.PropTypes.string.isRequired,
		customCSS:	React.PropTypes.string
	},

	DEFAULT_CSS_STYLE: 'bRadioButtonCustom',

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
				<RadioButtonCircle	isChecked	= {this.props.isChecked}
									isDisabled	= {this.props.isDisabled}
									handleClick	= {this.props.onClick}
				/>
				<RadioButtonLabel	text		= {this.props.text}
									handleClick	= {this.props.onClick}
				/>
			</div>
		);
	}
});

module.exports = RadioButtonCustom;