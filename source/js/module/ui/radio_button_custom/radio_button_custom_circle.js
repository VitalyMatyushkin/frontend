//@flow

const	React					= require('react'),

		RadioButtonCustomStyle	= require('./../../../../styles/ui/radio_button_custom/radio_button_custom.scss');

const RadioButtonCircle = React.createClass({
	propTypes: {
		isChecked:		React.PropTypes.bool.isRequired,
		handleClick:	React.PropTypes.func.isRequired,
		isDisabled:		React.PropTypes.bool
	},
	renderCircle: function() {
		switch (true) {
			case this.props.isDisabled:
				return <i className = "fa fa-circle-o fa-lg mGrayColor" aria-hidden = "true"></i>;
			case !this.props.isChecked:
				return <i className = "fa fa-circle-o fa-lg" aria-hidden = "true"></i>;
			case this.props.isChecked:
				return <i className = "fa fa-dot-circle-o fa-lg" aria-hidden = "true"></i>;
		}
	},
	render: function() {
		return (
			<div	className	= "eRadioButtonCustom_circle"
					onClick		= {this.props.handleClick}
			>
				{this.renderCircle()}
			</div>
		);
	}
});

module.exports = RadioButtonCircle;