const	React		= require('react'),
		RivalInfo	= require('module/as_manager/pages/event/view/rivals/rival_info/rival_info'),
		Players		= require('module/as_manager/pages/event/view/rivals/players');

const Rival = React.createClass({
	propTypes: {
		rival:			React.PropTypes.object.isRequired,
		event:			React.PropTypes.object.isRequired,
		mode:			React.PropTypes.string.isRequired,
		activeSchoolId:	React.PropTypes.string.isRequired
	},
	render: function() {
		return (
			<div className="bEventTeams_col">
				<RivalInfo
					rival			= { this.props.rival }
					event			= { this.props.event }
					mode			= { this.props.mode }
					activeSchoolId	= { this.props.activeSchoolId }
				/>
				<Players
					players						= {this.props.rival.team.players}
					teamId						= {this.props.rival.team.id}
					isOwner						= {this.props.rival.school.id === this.props.activeSchoolId}
					individualScoreAvailable	= {true}
					mode						= {this.props.mode}
					event						= {this.props.event}
					customCss					= {''}
				/>
			</div>
		);
	}
});

module.exports = Rival;