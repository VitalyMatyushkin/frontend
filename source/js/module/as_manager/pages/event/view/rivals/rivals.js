const	React			= require('react'),
		Immutable		= require('immutable'),
		Morearty		= require('morearty'),
		Rival			= require('module/as_manager/pages/event/view/rivals/rival/rival'),
		TeamHelper		= require('module/ui/managers/helpers/team_helper'),
		EventHelper		= require('module/helpers/eventHelper'),
		InvitesMixin	= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		classNames		= require('classnames'),
		RivalsStyle		= require('../../../../../../../styles/ui/rivals/rivals.scss');

const Rivals = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	propTypes: {
		activeSchoolId:							React.PropTypes.string.isRequired,
		handleClickOpponentSchoolManagerButton:	React.PropTypes.func
	},
	listeners: [],
	componentWillUnmount: function() {
		this.listeners.forEach(listener => this.getDefaultBinding().removeListener(listener));
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
					rival.isTeamScoreWasChanged = false;
					rival.isIndividualScoreAvailable = this.getInitValueForIsIndividualScoreAvailable(rival);
					this.initSchoolResultsForRival(rival, event);

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

		this.addListenerForTeamScore();

		console.log('EVENT: ');
		console.log(event);
		console.log('RIVALS: ');
		console.log(rivals);
	},
	initSchoolResultsForRival: function(rival, event) {
		if(TeamHelper.isInterSchoolsEventForTeamSport(event)) {
			if(typeof rival.team === 'undefined') {
				const	schoolId				= rival.school.id,
						currentSchoolScoreData	= event.results.schoolScore.find(scoreData => scoreData.schoolId === schoolId);

				if(typeof currentSchoolScoreData === 'undefined') {
					event.results.schoolScore.push(
						{
							schoolId:	schoolId,
							score:		0
						}
					);
					this.getDefaultBinding().set('model', Immutable.fromJS(event));
				}
			} else {
				const	teamId					= rival.team.id,
						currentTeamScoreData	= event.results.teamScore.find(scoreData => scoreData.teamId === teamId);

				if(typeof currentTeamScoreData === 'undefined') {
					event.results.teamScore.push(
						{
							teamId:	teamId,
							score:		0
						}
					);
					this.getDefaultBinding().set('model', Immutable.fromJS(event));
				}
			}
		}
	},
	getInitValueForIsIndividualScoreAvailable: function(rival) {
		const	binding	= this.getDefaultBinding(),
				event	= binding.toJS(`model`);

		if(TeamHelper.isTeamSport(event) && EventHelper.isNotFinishedEvent(event)) {
			return false;
		} else if(TeamHelper.isTeamSport(event) && !EventHelper.isNotFinishedEvent(event)) {
			const	schoolId		= rival.school.id,
					foundScoreData	= event.results.schoolScore.find(scoreData => scoreData.schoolId === schoolId);

			const	team						= rival.team;
			let		foundIndividualScoreData	= undefined;
			if(typeof team !== 'undefined') {
				foundIndividualScoreData = event.results.individualScore.find(scoreData => scoreData.teamId === team.id);
			}

			return typeof foundScoreData !== 'undefined' || typeof foundIndividualScoreData !== 'undefined';
		}
	},
	addListenerForTeamScore: function() {
		const	teamScoreBinding	= this.getDefaultBinding().sub(`model.results.teamScore`),
				teamScores			= teamScoreBinding.toJS();

		for(let i = 0; i < teamScores.length; i++) {
			this.listeners.push(teamScoreBinding.sub(i).addListener((eventDescriptor) => {
				const binding = this.getDefaultBinding();

				const	prevValue		= eventDescriptor.getPreviousValue().toJS(),
						currentValue	= eventDescriptor.getCurrentValue().toJS();

				if(
					binding.toJS('mode') === 'closing' &&
					prevValue.score !== currentValue.score
				) {
					const	rivals			= binding.toJS('rivals'),
							teamId			= currentValue.teamId,
							foundRivalIndex	= rivals.findIndex(rival => rival.team.id === teamId),
							foundRival		= rivals[foundRivalIndex];

					if(
						typeof foundRival !== 'undefined' &&
						!foundRival.isIndividualScoreAvailable &&
						!foundRival.isTeamScoreWasChanged
					) {
						rivals[foundRivalIndex].isTeamScoreWasChanged = true;
						binding.set('rivals', Immutable.fromJS(rivals));

						this.clearIndividualScoreByTeamId(teamId);
					}
				}
			}));
		}
	},
	isSync: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return binding.toJS('sync');
	},
	/**
	 * Function copy model.results.individualScore by teamId to model.individualScoreForRemove.
	 * individualScoreForRemove - it's a array of scores. These scores will be removed after score submit.
	 * @param teamId
	 */
	setIndividualScoreForRemoveByTeamId: function(teamId) {
		const binding = this.getDefaultBinding();

		const	individualScoreForRemove	= binding.toJS(`model.individualScoreForRemove`),
				newIndividualScoreForRemove	= binding.toJS(`model.results.individualScore`).filter(s => s.teamId === teamId);

		binding.set(
			`model.individualScoreForRemove`,
			Immutable.fromJS(individualScoreForRemove.concat(newIndividualScoreForRemove))
		);
	},
	clearIndividualScoreForRemoveByTeamId: function(teamId) {
		const binding = this.getDefaultBinding();

		const individualScoreForRemove = binding.toJS(`model.individualScoreForRemove`).filter(s => s.teamId !== teamId);

		binding.set(`model.individualScoreForRemove`, Immutable.fromJS(individualScoreForRemove));
	},
	clearIndividualScoreByTeamId: function(teamId) {
		const binding = this.getDefaultBinding();

		const updScore = binding.toJS(`model.results.individualScore`).filter(s => s.teamId !== teamId);

		binding.set(`model.results.individualScore`, Immutable.fromJS(updScore));
	},
	clearTeamScoreByTeamId: function(teamId) {
		const binding = this.getDefaultBinding();

		const score = binding.toJS(`model.results.teamScore`);
		score.forEach(s => {
			if(s.teamId === teamId) {
				s.score = 0;
			}
		});

		binding.set(`model.results.teamScore`, Immutable.fromJS(score));
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
	onChangeIndividualScoreAvailable: function(rivalIndex) {
		const	binding	= this.getDefaultBinding(),
				rivals	= binding.toJS('rivals'),
				teamId	= rivals[rivalIndex].team.id;

		const newValueIsIndividualScoreAvailable = !rivals[rivalIndex].isIndividualScoreAvailable;

		rivals[rivalIndex].isIndividualScoreAvailable = newValueIsIndividualScoreAvailable;

		if(newValueIsIndividualScoreAvailable) {
			this.clearIndividualScoreForRemoveByTeamId(teamId)
		} else {
			this.setIndividualScoreForRemoveByTeamId(teamId);
		}

		if(rivals[rivalIndex].isTeamScoreWasChanged && newValueIsIndividualScoreAvailable) {
			this.clearTeamScoreByTeamId(teamId);
			rivals[rivalIndex].isTeamScoreWasChanged = false;
		}

		binding.set('rivals', Immutable.fromJS(rivals));
	},
	onClickEditTeam: function(rivalIndex) {
		this.getDefaultBinding()
			.atomically()
			.set('mode',				'edit_squad')
			.set('selectedRivalIndex',	rivalIndex)
			.commit();
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

		const xmlRivals = [];
		let row = [];

		rivals.forEach((rival, rivalIndex) => {
			row.push(
				<Rival
					key										= {`rival_${rivalIndex}`}
					rivalIndex								= {rivalIndex}
					rival									= {rival}
					event									= {binding.toJS('model')}
					mode									= {binding.toJS('mode')}
					onChangeScore							= {this.onChangeScore.bind(this, rivalIndex)}
					onClickEditTeam							= {this.onClickEditTeam.bind(this, rivalIndex)}
					onChangeIndividualScoreAvailable		= {this.onChangeIndividualScoreAvailable.bind(this, rivalIndex)}
					handleClickOpponentSchoolManagerButton	= {
						this.props.handleClickOpponentSchoolManagerButton.bind(this, rivalIndex)
					}
					activeSchoolId							= {this.props.activeSchoolId}
				/>
			);

			if(
				rivalIndex % 2 !== 0 ||
				rivalIndex === rivals.length - 1
			) {
				const rivalRowStyle = classNames({
					eRivals_row	: true,
					mFirst		: this.props.rivalIndex  === 1
				});

				xmlRivals.push(
					<div
						key			= {`rival_row_${rivalIndex}`}
						className	= {rivalRowStyle}
					>
						{row}
					</div>
				);
				row = [];
			}
		});

		return xmlRivals;
	},
	render: function() {
		if(this.isSync()) {
			const binding = this.getDefaultBinding();

			const	event	= binding.toJS('model'),
					rivals	= binding.toJS('rivals');

			console.log('EVENT: ');
			console.log(event);
			console.log('RIVALS: ');
			console.log(rivals);

			return (
				<div className="bRivals">
					{this.renderRivals()}
				</div>
			);
		} else {
			return null;
		}
	}
});

module.exports = Rivals;