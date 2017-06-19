const React = require('react');

const RemovePlayersButton = React.createClass({
	propTypes: {
		// if true - remove player button doesn't response to user click
		isRemovePlayerButtonBlock:		React.PropTypes.bool.isRequired,
		// handler function for onClick event
		handleClickRemovePlayerButton:	React.PropTypes.func.isRequired
	},

	handleClickRemovePlayerButton: function() {
		if(!this.props.isRemovePlayerButtonBlock) {
			this.props.handleClickRemovePlayerButton();
		}
	},

	render: function() {
		return (
			<div	className	= "eTeam_removeButton"
					id  		= "removePlayer_button"
					onClick		= { this.handleClickRemovePlayerButton }
			>
			</div>
		);
	}
});

module.exports = RemovePlayersButton;