// main components
const	React				= require('react'),
		Immutable			= require('immutable'),
		Morearty			= require('morearty'),
		propz 				= require('propz');

// react components
const	BlockViewRivals		= require('module/as_manager/pages/event/view/rivals/block_view_rivals/block_view_rivals'),
		TableViewRivals		= require('module/as_manager/pages/event/view/rivals/table_view_rivals/table_view_rivals');

// helper
const	RivalManager		= require('module/as_manager/pages/event/view/rivals/helpers/rival_manager'),
		TeamHelper			= require('module/ui/managers/helpers/team_helper'),
		EventHelper			= require('module/helpers/eventHelper');

// consts
const	ViewModeConsts		= require('module/as_manager/pages/event/view/rivals/consts/view_mode_consts'),
		ManagerConsts		= require('module/ui/managers/helpers/manager_consts');

const Rivals = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId:							React.PropTypes.string.isRequired,
		isShowControlButtons:					React.PropTypes.bool,
		handleClickOpponentSchoolManagerButton:	React.PropTypes.func,
		handleClickRemoveTeamButton:			React.PropTypes.func
	},
	listeners: [],
	getDefaultProps: function(){
		return {
			isShowControlButtons: true
		};
	},
	componentWillUnmount: function() {
		this.listeners.forEach(listener => this.getDefaultBinding().removeListener(listener));
	},
	componentWillMount: function() {
		const	binding		= this.getDefaultBinding();

		this.initViewMode();

		const	event		= binding.toJS('model'),
				eventType	= event.eventType;

		// Get main part of rivals
		let		rivals		= RivalManager.getRivalsByEvent(this.props.activeSchoolId, event);

		// Additional preparation
		if(TeamHelper.isTeamSport(event)) {
			rivals.forEach(rival => {
				rival.isTeamScoreWasChanged = false;
				rival.isIndividualScoreAvailable = this.getInitValueForIsIndividualScoreAvailable(rival);
				this.initResultsForRival(rival, event);
			});
		} else if(TeamHelper.isIndividualSport(event)) {
			if(EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] === eventType) {
				rivals.forEach(rival => {
					rival.isIndividualScoreAvailable = true;
					rival.isTeamScoreWasChanged = false;

					rival.score = this.getExtraScoreForRival(rival);
				});

				this.addListenerForChangeMode();
			}
		}

		binding.atomically()
			.set('isRivalsSync',	true)
			.set('rivals',			Immutable.fromJS(rivals))
			.commit();

		this.addListenerForTeamScore();
	},
	initViewMode: function() {
		this.getDefaultBinding().set('viewMode', ViewModeConsts.VIEW_MODE.BLOCK_VIEW);
	},
	getExtraScoreForRival: function(rival) {
		let extraScoreRival = 0;

		rival.players.forEach( player => {
			const extraScorePlayer = propz.get(player, ['extraScore']);
			
			if (typeof extraScorePlayer !== 'undefined') {
				extraScoreRival += extraScorePlayer;
			}
		});
		return extraScoreRival;
	},
	initResultsForRival: function(rival, event) {
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
				this.initTeamResultsForRival(rival, event);
			}
		} else if(TeamHelper.isHousesEventForTeamSport(event)) {
			if(typeof rival.team === 'undefined') {
				const	houseId					= rival.house.id,
						currentHouseScoreData	= event.results.houseScore.find(scoreData => scoreData.houseId === houseId);

				if(typeof currentHouseScoreData === 'undefined') {
					event.results.houseScore.push(
						{
							houseId:	houseId,
							score:		0
						}
					);
					this.getDefaultBinding().set('model', Immutable.fromJS(event));
				}
			} else {
				this.initTeamResultsForRival(rival, event);
			}
		} if(TeamHelper.isInternalEventForTeamSport(event)) {
			this.initTeamResultsForRival(rival, event);
		}
	},
	initTeamResultsForRival: function(rival, event) {
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
	},
	getInitValueForIsIndividualScoreAvailable: function(rival) {
		const	binding	= this.getDefaultBinding(),
				event	= binding.toJS(`model`);

		if(TeamHelper.isTeamSport(event) && EventHelper.isNotFinishedEvent(event)) {
			return false;
		} else if(TeamHelper.isTeamSport(event) && !EventHelper.isNotFinishedEvent(event)) {
			let teamScoreData,
				individualScoreData;
			
			const teamId = propz.get(rival,['team', 'id']);
			if (typeof teamId !== 'undefined') {
				teamScoreData = event.results.teamScore.find(scoreData =>
					scoreData.teamId === teamId
				);
				individualScoreData	= event.results.individualScore.find(scoreData =>
					scoreData.teamId === teamId
				);
			}
			
			return (
				typeof teamScoreData !== 'undefined' &&
				typeof individualScoreData !== 'undefined'
			);
		}
	},
	getRandomString: function() {
		// just current date in timestamp view
		return + new Date();
	},
	//We use this listener, because we want sort players by score when we enter new time/distance/plain and send this data on server
	//When we send data on server, we just reload component
	addListenerForChangeMode: function() {
		const binding = this.getDefaultBinding();

		this.listeners.push(binding.addListener( (eventDescriptor) => {
			const	prevValue		= eventDescriptor.getPreviousValue().toJS(),
					currentValue	= eventDescriptor.getCurrentValue().toJS();
			
			if(prevValue.mode === 'closing' && currentValue.mode === 'general') {
				binding.set('eventComponentKey', Immutable.fromJS(this.getRandomString()));
			}
		}));
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
	handleHouseScoreChanges: function(houseId, newScoreData) {
		const	binding			= this.getDefaultBinding(),
				results			= binding.toJS('model.results'),
				houseScoreArray	= results.houseScore;

		let scoreData = houseScoreArray.find(s => s.houseId === houseId);

		if(typeof scoreData === 'undefined') {
			scoreData = {
				houseId:	houseId,
				score:		newScoreData.value
			};
			houseScoreArray.push(scoreData);
		} else {
			scoreData.score = newScoreData.value;
		}

		binding.set('model.results.houseScore', Immutable.fromJS(results.houseScore));
	},
	handlePlayerAthleticScoreChanges: function(player, score){
		const	binding					= this.getDefaultBinding(),
				event					= binding.toJS('model'),
				individualScoreArray	= event.results.individualScore;
		
		let playerScoreData = individualScoreArray.find(s =>
			s.userId === player.userId && s.permissionId === player.permissionId
		);
		
		if(typeof playerScoreData === 'undefined') {
			playerScoreData = {
				userId:			player.userId,
				permissionId:	player.permissionId,
				score:			0,
				richScore: {
					points: 0
				}
			};
			individualScoreArray.push(playerScoreData);
		}
		/** set score */
		playerScoreData.score = score.scoreAthletic.score;
		playerScoreData.richScore = Object.assign({}, {points: score.scoreAthletic.extraScore});
		playerScoreData.isChanged = true;
		playerScoreData.isValid = score.isValid;
		binding.set('model.results.individualScore', Immutable.fromJS(individualScoreArray));
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
			.set('selectedRivalIndex',	Immutable.fromJS(rivalIndex))
			.set('teamManagerMode',		ManagerConsts.MODE.CHANGE_TEAM)
			.commit();
	},
	onChangeScore: function(rivalIndex, scoreBundleName, scoreData, player) {
		const	binding	= this.getDefaultBinding(),
				rivals	= binding.toJS('rivals'),
				rival	= rivals[rivalIndex];

		if(scoreBundleName === 'schoolScore') {
			const schoolId = rival.school.id;

			this.handleSchoolScoreChanges(schoolId, scoreData);
		} else if(scoreBundleName === 'houseScore') {
			const houseId = rival.house.id;

			this.handleHouseScoreChanges(houseId, scoreData);
		} else if(scoreBundleName === 'teamScore') {
			const teamId = rival.team.id;

			this.changePointsForTeam(teamId, scoreData);
		} else if(scoreBundleName === 'individualData') {
			if (typeof rival.team !== 'undefined'){
				const teamId = rival.team.id;
				
				this.handlePlayerScoreChanges(
					teamId,
					player,
					scoreData
				);
			} else {
				this.handlePlayerAthleticScoreChanges (player, scoreData);
			}
		}
	},
	render: function() {
		if(this.isSync()) {
			const	binding		= this.getDefaultBinding();

			const	viewMode	= binding.toJS('viewMode'),
					rivals		= binding.toJS('rivals'),
					mode		= binding.toJS('mode'),
					event		= binding.toJS('model');

			switch (viewMode) {
				case ViewModeConsts.VIEW_MODE.BLOCK_VIEW: {
					return (
						<BlockViewRivals
							rivals									= { rivals }
							mode									= { mode }
							event									= { event }
							activeSchoolId							= { this.props.activeSchoolId }
							isShowControlButtons					= { this.props.isShowControlButtons }
							onChangeScore							= { this.onChangeScore }
							onClickEditTeam							= { this.onClickEditTeam }
							onChangeIndividualScoreAvailable		= { this.onChangeIndividualScoreAvailable }
							handleClickOpponentSchoolManagerButton	= { this.props.handleClickOpponentSchoolManagerButton }
							handleClickRemoveTeamButton				= { this.props.handleClickRemoveTeamButton }
						/>
					);
				}
				case ViewModeConsts.VIEW_MODE.TABLE_VIEW: {
					return (
						<TableViewRivals
							rivals									= { rivals }
							mode									= { mode }
							event									= { event }
							activeSchoolId							= { this.props.activeSchoolId }
							isShowControlButtons					= { this.props.isShowControlButtons }
							onChangeScore							= { this.onChangeScore }
							onClickEditTeam							= { this.onClickEditTeam }
							onChangeIndividualScoreAvailable		= { this.onChangeIndividualScoreAvailable }
							handleClickOpponentSchoolManagerButton	= { this.props.handleClickOpponentSchoolManagerButton }
							handleClickRemoveTeamButton				= { this.props.handleClickRemoveTeamButton }
						/>
					);
				}
			}
		} else {
			return null;
		}
	}
});

module.exports = Rivals;