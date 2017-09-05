const 	React 		= require('react'),
		SportHelper	= require('module/helpers/sport_helper');

const	OverallPlayersStyle	= require('../../../../../../../../styles/ui/b_overall_player.scss');

const PlayerSchool = React.createClass({
	propTypes: {
		player: React.PropTypes.object.isRequired
	},
	render: function() {
		return (
			<div className="eOverallPlayer_school">
				<span>{this.props.player.school.name}</span>
			</div>
		);
	}
});

module.exports = PlayerSchool;