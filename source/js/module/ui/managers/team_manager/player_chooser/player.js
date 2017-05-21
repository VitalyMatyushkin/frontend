const	React		= require('react'),
		classNames	= require('classnames');

const Player = React.createClass({
	propTypes: {
		player				: React.PropTypes.object.isRequired,
		handleClickStudent	: React.PropTypes.func.isRequired
	},
	getInitialState: function(){
		return {
			isSelected: false
		};
	},
	handleClickPlayer: function() {
		const self = this;

		self.setState({
			isSelected: !self.state.isSelected
		});
		self.props.handleClickStudent(self.props.player.id);
	},
	handleDoubleClickPlayer: function() {
		//TODO implement me
	},
	render: function() {
		const self = this;

		const	player = self.props.player,
				playerClass = classNames({
					eTeam_player:	true,
					mSelected:		self.state.isSelected
				}),
				formName = typeof player.form !== 'undefined' ? player.form.name : '';

		return (
			<div
				className={playerClass}
				onClick={self.handleClickPlayer}
			>
				<div className="ePlayerChooser_playerName">
					{`${player.firstName} ${player.lastName}`}
				</div>
				<div className="ePlayerChooser_playerForm">
					{formName}
				</div>
			</div>
		);
	}
});

module.exports = Player;