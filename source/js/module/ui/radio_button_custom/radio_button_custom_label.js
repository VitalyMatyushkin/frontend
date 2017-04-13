//@flow

const	React					= require('react'),

		RadioButtonCustomStyle	= require('./../../../../styles/ui/radio_button_custom/radio_button_custom.scss');

const RadioButtonLabel = React.createClass({
	propTypes: {
		text:			React.PropTypes.string.isRequired,
		handleClick:	React.PropTypes.func.isRequired
	},
	render: function() {
		return (
			<div	className	= "eRadioButtonCustom_text"
					onClick		= {this.props.handleClick}
			>
				{this.props.text}
			</div>
		);
	}
});

module.exports = RadioButtonLabel;