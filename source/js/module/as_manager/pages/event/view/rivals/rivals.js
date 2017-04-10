const	React			= require('react'),
		Immutable		= require('immutable'),
		Morearty		= require('morearty'),
		Rival			= require('module/as_manager/pages/event/view/rivals/rival/rival'),
		TeamHelper		= require('module/ui/managers/helpers/team_helper'),
		EventHelper		= require('module/helpers/eventHelper'),
		InvitesMixin	= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		EventTeamsView	= require('./event_teams_view');

const Rivals = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},
	componentWillMount: function() {
		const binding = this.getDefaultBinding();

		const	event		= binding.toJS('model'),
				eventType	= event.eventType;

		let	rivals		= [];

		if(TeamHelper.isTeamSport(event)) {
			if(EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] === eventType) {
				const	schoolsData	= event.schoolsData,
						teamsData	= event.teamsData;

				// iterate all schools
				schoolsData.forEach(school => {
					const rival = {};

					rival.school = school;
					// search all teams for current team
					teamsData.forEach(t => {
						if(t.schoolId === school.id) {
							rival.team = t;
							rivals.push(rival);
						}
					});
				});

				rivals = rivals.sort((rival1, rival2) => {
					if(rival1.school.id === this.props.activeSchoolId && rival2.school.id !== this.props.activeSchoolId) {
						return -1;
					}
					if(rival1.school.id !== this.props.activeSchoolId && rival2.school.id === this.props.activeSchoolId) {
						return 1;
					}

					return 0;
				});
			}
		}

		binding.set('rivals', Immutable.fromJS(rivals));

		console.log('EVENT: ');
		console.log(event);
		console.log('RIVALS: ');
		console.log(rivals);
	},
	isSync: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return binding.toJS('sync');
	},
	renderRivals: function() {
		const binding = this.getDefaultBinding();

		const rivals = binding.toJS('rivals');

		return rivals.map((rival, rivalIndex) => {
			return (
				<Rival
					key				= {`rival_${rivalIndex}`}
					rival			= {rival}
					event			= {binding.toJS('model')}
					mode			= {binding.toJS('mode')}
					activeSchoolId	= {this.props.activeSchoolId}
				/>
			);
		});
	},
	render: function() {
		if(this.isSync()) {
			return (
				<div className="bEventTeams">
					{this.renderRivals()}
				</div>
			);
		} else {
			return null;
		}
	}
});

module.exports = Rivals;