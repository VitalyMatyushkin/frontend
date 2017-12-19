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
	render: function() {
		const	player		= this.props.player,
				playerClass	= classNames({
					ePlayerChooser_player:	true,
					mSelected:				this.state.isSelected
				}),
				formName	= typeof player.form !== 'undefined' ? player.form.name : '';

		return (
			<tr
				className	= { playerClass }
				onClick		= { this.handleClickPlayer }
			>
				<td className="col-md-4">
					{`${player.firstName} ${player.lastName}`}
				</td>
				<td className="col-md-3">
					{formName}
				</td>
			</tr>
		);
	}
});

module.exports = Player;