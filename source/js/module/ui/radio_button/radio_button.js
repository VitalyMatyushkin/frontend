const	React	= require('react');

const TeamSaveModePanel = React.createClass({
	propTypes: {
		isChecked:	React.PropTypes.bool.isRequired,
		text:		React.PropTypes.array.isRequired,
		onClick:	React.PropTypes.func.isRequired
	},

	render: function() {
		return (
			<div className="bRadioButton">
				<input	className	= "bRadioButton_input"
						type		= "radio"
						checked		= { this.props.isChecked }
						onClick		= { this.props.onClick }
				/>
				<div	className="bRadioButton_text">
					{ this.props.text }
				</div>
			</div>
		);
	}
});

module.exports = TeamSaveModePanel;