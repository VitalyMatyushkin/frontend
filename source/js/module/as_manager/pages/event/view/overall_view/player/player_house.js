const	React				= require('react');

const	OverallPlayersStyle	= require('../../../../../../../../styles/ui/b_overall_player.scss');

const PlayerHouse = React.createClass({
	propTypes: {
		player: React.PropTypes.object.isRequired
	},
	render: function() {
		return (
			<div className="eOverallPlayer_school">
				<span>{this.props.player.house.name}</span>
			</div>
		);
	}
});

module.exports = PlayerHouse;