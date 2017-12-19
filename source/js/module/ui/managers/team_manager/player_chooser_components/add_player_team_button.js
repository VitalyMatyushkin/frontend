const React = require('react');

const	AddPlayerTeamButton	= React.createClass({
	propTypes: {
		isAddTeamButtonBlocked:		React.PropTypes.bool.isRequired,
		handleClickAddTeamButton:	React.PropTypes.func.isRequired
	},

	handleClickAddTeamButton: function() {
		if(!this.props.isAddTeamButtonBlocked) {
			return this.props.handleClickAddTeamButton();
		}
	},

	render: function() {
		return (
			<div	className	= "ePlayerChooser_addToTeamButton"
					id			= "addPlayer_button"
					onClick		= { this.props.handleClickAddTeamButton }
			>
			</div>
		);
	}
});

module.exports = AddPlayerTeamButton;