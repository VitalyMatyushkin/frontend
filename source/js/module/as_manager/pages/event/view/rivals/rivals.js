const	React			= require('react'),
		Immutable		= require('immutable'),
		Morearty		= require('morearty'),
		Rival			= require('module/as_manager/pages/event/view/rivals/rival/rival'),
		TeamHelper		= require('module/ui/managers/helpers/team_helper'),
		EventHelper		= require('module/helpers/eventHelper'),
		InvitesMixin	= require('module/as_manager/pages/invites/mixins/invites_mixin');

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
						}
					});

					rivals.push(rival);
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
	handlePlayerScoreChanges: function(teamId, player, score) {
		const	binding = this.getDefaultBinding(),
				event	= binding.toJS('model');

		// Order of score changes is important!
		// 1) Team score
		// 2) Individual score

		// Sum current player points with other player points = team points
		// But only for team games
		this.changePointsForPlayer(teamId, player, score);
		if(	typeof teamId !== 'undefined' && TeamHelper.isTeamSport(event)) {
			this.changePointsForTeamByIndividualScoreChanges(teamId);
		}
	},
	handleSchoolScoreChanges: function(schoolId, newScoreData) {
		const	binding	= this.getDefaultBinding(),
				event	= binding.toJS('model'),
				results	= event.results;

		const schoolScoreArray = event.results.schoolScore;

		let scoreData = schoolScoreArray.find(s => s.schoolId === schoolId);

		if(typeof scoreData === 'undefined') {
			scoreData = {
				schoolId:	schoolId,
				score:		newScoreData.value
			};
			schoolScoreArray.push(scoreData);
		} else {
			scoreData.score = newScoreData.value;
		}

		binding.set('model.results.schoolScore', Immutable.fromJS(results.schoolScore));
	},
	changePointsForPlayer: function(teamId, player, score) {
		const	binding					= this.getDefaultBinding(),
				event					= binding.toJS('model'),
				individualScoreArray	= event.results.individualScore;

		let playerScoreData = individualScoreArray.find(s =>
			s.userId === player.userId && s.permissionId === player.permissionId && s.teamId === teamId
		);

		if(typeof playerScoreData === 'undefined') {
			playerScoreData = {
				userId:			player.userId,
				teamId: 		teamId,
				permissionId:	player.permissionId,
				score:			0
			};
			individualScoreArray.push(playerScoreData);
		}
		/** set score */
		playerScoreData.score = score.value;
		playerScoreData.isChanged = true;
		playerScoreData.isValid = score.isValid;

		binding.set('model.results.individualScore', Immutable.fromJS(individualScoreArray));
	},
	changePointsForTeam: function(teamId, newScoreData) {
		const	binding			= this.getDefaultBinding(),
				event			= binding.toJS('model'),
				teamScoreArray	= event.results.teamScore;

		let teamScoreData = teamScoreArray.find(s => s.teamId === teamId);

		if(typeof teamScoreData === 'undefined') {
			teamScoreData = {
				teamId:	teamId,
				score:	newScoreData.value
			};
			teamScoreArray.push(teamScoreData);
		} else {
			teamScoreData.score = newScoreData.value;
		}
		teamScoreData.isChanged = true;

		binding.set('model', Immutable.fromJS(event));
	},
	changePointsForTeamByIndividualScoreChanges: function(teamId) {
		const	binding			= this.getDefaultBinding(),
				event			= binding.toJS('model'),
				teamScoreArray	= event.results.teamScore;

		let teamScoreData = teamScoreArray.find(s => s.teamId === teamId);

		if(!teamScoreData) {
			teamScoreData = {
				teamId:	teamId,
				score:	0
			};
			teamScoreArray.push(teamScoreData);
		}
		/** set score */
		teamScoreData.score = TeamHelper.calculateTeamPoints(event, teamId);
		teamScoreData.isChanged = true;

		binding.set('model', Immutable.fromJS(event));
	},
	onClickEditTeam: function(rivalIndex) {
		this.getDefaultBinding()
			.atomically()
			.set('mode',				'edit_squad')
			.set('selectedRivalIndex',	rivalIndex)
			.commit();
	},
	onChangeIndividualScoreAvailable: function(order) {
		const binding = this.getDefaultBinding();

		binding.set(`individualScoreAvailable.${order}.value`, !binding.get(`individualScoreAvailable.${order}.value`));
	},
	onChangeScore: function(rivalIndex, scoreBundleName, scoreData, player) {
		//console.log(rivalIndex);
		//console.log(scoreBundleName);
		//console.log(scoreData);
		//console.log(player);

		const	binding	= this.getDefaultBinding(),
				rivals	= binding.toJS('rivals'),
				rival	= rivals[rivalIndex];

		if(scoreBundleName === 'schoolScore') {
			const schoolId = rival.school.id;

			this.handleSchoolScoreChanges(schoolId, scoreData);
		} else if(scoreBundleName === 'teamScore') {
			const teamId = rival.team.id;

			this.changePointsForTeam(teamId, scoreData);
		} else if(scoreBundleName === 'individualData') {
			const teamId = rival.team.id;

			this.handlePlayerScoreChanges(
				teamId,
				player,
				scoreData
			);
		}
	},
	renderRivals: function() {
		const binding = this.getDefaultBinding();

		const rivals = binding.toJS('rivals');

		return rivals.map((rival, rivalIndex) => {
			return (
				<Rival
					key									= {`rival_${rivalIndex}`}
					rival								= {rival}
					event								= {binding.toJS('model')}
					mode								= {binding.toJS('mode')}
					isIndividualScoreAvailable			= {binding.toJS(`individualScoreAvailable.${rivalIndex}.value`)}
					onChangeIndividualScoreAvailable	= {this.onChangeIndividualScoreAvailable.bind(this, rivalIndex)}
					onChangeScore						= {this.onChangeScore.bind(this, rivalIndex)}
					onClickEditTeam						= {this.onClickEditTeam.bind(this, rivalIndex)}
					activeSchoolId						= {this.props.activeSchoolId}
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