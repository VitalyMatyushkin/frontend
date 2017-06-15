const	React						= require('react'),
		Immutable					= require('immutable'),
		Morearty					= require('morearty'),
		Rival						= require('module/as_manager/pages/event/view/rivals/rival/rival'),
		TeamHelper					= require('module/ui/managers/helpers/team_helper'),
		EventHelper					= require('module/helpers/eventHelper'),
		SportHelper					= require('module/helpers/sport_helper'),
		InvitesMixin				= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		classNames					= require('classnames'),
		propz 						= require('propz'),
		SelectForCricketWrapper 	= require('module/as_manager/pages/event/view/rivals/select_for_cricket/select_for_cricket_wrapper'),
		CricketResultBlock 			= require('module/as_manager/pages/event/view/rivals/cricket_result_block/cricket_result_block'),
		RivalsStyle					= require('../../../../../../../styles/ui/rivals/rivals.scss');

const Rivals = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	propTypes: {
		activeSchoolId:							React.PropTypes.string.isRequired,
		isShowControlButtons:					React.PropTypes.bool,
		handleClickOpponentSchoolManagerButton:	React.PropTypes.func
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
		const binding = this.getDefaultBinding();

		const	event		= binding.toJS('model'),
				eventType	= event.eventType;

		let	rivals		= [];

		this.initViewMode();

		if(TeamHelper.isTeamSport(event)) {
			if(EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] === eventType) {
				const	schoolsData	= event.schoolsData,
						teamsData	= event.teamsData;

				// iterate all schools
				schoolsData.forEach(school => {
					const rival = {};

					rival.school = school;
					let schoolInvite = undefined;
					if (typeof event.invites !== 'undefined') {
						schoolInvite = event.invites.find(invite => invite.invitedSchoolId === school.id);
					}
					
					if(typeof schoolInvite !== 'undefined') {
						rival.invite = schoolInvite;
					}

					// search all teams for current school
					teamsData.forEach(t => {
						if(t.schoolId === school.id) {
							rival.team = t;
						}
					});
					rival.isTeamScoreWasChanged = false;
					rival.isIndividualScoreAvailable = this.getInitValueForIsIndividualScoreAvailable(rival);
					this.initResultsForRival(rival, event);

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
			} else if(EventHelper.clientEventTypeToServerClientTypeMapping['houses'] === eventType) {
				const	schoolsData	= event.schoolsData,
						housesData	= event.housesData,
						teamsData	= event.teamsData;

				// iterate all schools
				housesData.forEach(house => {
					const rival = {};

					rival.school = schoolsData[0];
					rival.house = house;
					// search all teams for current house
					teamsData.forEach(t => {
						if(t.houseId === house.id) {
							rival.team = t;
						}
					});
					rival.isTeamScoreWasChanged = false;
					rival.isIndividualScoreAvailable = this.getInitValueForIsIndividualScoreAvailable(rival);
					this.initResultsForRival(rival, event);

					rivals.push(rival);
				});

				rivals = rivals.sort((rival1, rival2) => {
					if(rival1.house.name < rival2.house.name) {
						return -1;
					}
					if(rival1.house.name > rival2.house.name) {
						return 1;
					}

					return 0;
				});
			} else if(EventHelper.clientEventTypeToServerClientTypeMapping['internal'] === eventType) {
				const	schoolsData	= event.schoolsData,
						teamsData	= event.teamsData;

				// iterate all schools
				teamsData.forEach(team => {
					const rival = {};

					rival.school = schoolsData[0];
					rival.team = team;

					rival.isTeamScoreWasChanged = false;
					rival.isIndividualScoreAvailable = this.getInitValueForIsIndividualScoreAvailable(rival);
					this.initResultsForRival(rival, event);

					rivals.push(rival);
				});

				rivals = rivals.sort((rival1, rival2) => {
					if(rival1.team.name < rival2.team.name) {
						return -1;
					}
					if(rival1.team.name > rival2.team.name) {
						return 1;
					}

					return 0;
				});
			}
		} else if (TeamHelper.isIndividualSport(event)){
			if (EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] === eventType) {
				
				if (binding.toJS('view_mode') === 'general') {
					const	schoolsData	= event.schoolsData,
							players 	= event.individualsData,
							scores 		= propz.get(event, ['results', 'individualScore']);
					// iterate all schools
					schoolsData.forEach(school => {
						const rival = {};
						
						rival.school = school;
						let schoolInvite = undefined;
						if (typeof event.invites !== 'undefined') {
							schoolInvite = event.invites.find(invite => invite.invitedSchoolId === school.id);
						}
						
						if(typeof schoolInvite !== 'undefined') {
							rival.invite = schoolInvite;
						}
						
						rival.isIndividualScoreAvailable = true;
						rival.isTeamScoreWasChanged = false;
						
						// search all players for current school
						rival.players = [];
						players.forEach( player => {
							const playerScoreObject = scores.find(score => score.userId === player.userId);
							
							if (typeof playerScoreObject !== 'undefined') {
								const 	playerScore 		= propz.get(playerScoreObject, ['score']),
										playerExtraScore 	= propz.get(playerScoreObject, ['richScore', 'extraScore']);
								
								player.score = playerScore;
								player.extraScore = playerExtraScore;
							} else {
								player.score = 0;
								player.extraScore = 0;
							}
							
							if(player.schoolId === school.id) {
								rival.players.push(player);
							}
						});
						
						rival.score = this.getExtraScoreForRival(rival);
						
						rivals.push(rival);
					});
					//If at least one opponent has extraScore then sort by extraScore else by activeSchoolId
					const isExtraScore = rivals.some(rival => rival.score !== 0);
					
					if (isExtraScore) {
						// Sort array of rivals by DESC of extraScores
						rivals = rivals.sort((rival1, rival2) => {
							return rival2.score - rival1.score;
						});
					} else {
						// Sort array of rivals by activeSchoolId
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
					
				} else {
					const 	rival 	= {},
							players = event.individualsData,
							scores 	= propz.get(event, ['results', 'individualScore']);
					
					rival.school = {};
					rival.players = [];
					players.forEach(player => {
						const playerScore = scores.find(score => score.userId === player.userId);
						
						if (typeof playerScore !== 'undefined') {
							player.score = playerScore.score;
						} else {
							player.score = 0;
						}
						rival.players.push(player);
					});
					
					rival.isIndividualScoreAvailable = true;
					rival.isTeamScoreWasChanged = false;
					this.addListenerForChangeMode();
					rivals.push(rival);
					
				}
			}
		}

		binding.atomically()
			.set('isRivalsSync',	true)
			.set('rivals',			Immutable.fromJS(rivals))
			.commit();

		this.addListenerForTeamScore();
		this.addListenerForViewMode();
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
	initViewMode: function() {
		const binding = this.getDefaultBinding();

		//Initial state
		if (typeof binding.toJS('view_mode') === 'undefined') {
			binding.set('view_mode', 'general');
		}
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
	addListenerForViewMode: function() {
		const 	binding = this.getDefaultBinding();
		
		this.listeners.push(binding.addListener( (eventDescriptor) => {
			const	prevValue		= eventDescriptor.getPreviousValue().toJS(),
					currentValue	= eventDescriptor.getCurrentValue().toJS();
			if (prevValue.view_mode !== currentValue.view_mode) {
				binding.set('eventComponentKey', Immutable.fromJS(this.getRandomString()));
			}
		}));
	},
	//We use this listener, because we want sort players by score when we enter new time/distance/plain and send this data on server
	//When we send data on server, we just copy new data (individualScores) in rivals(because rivals fill only when componentWillMount)
	addListenerForChangeMode: function() {
		const 	binding = this.getDefaultBinding();
		
		this.listeners.push(binding.addListener( (eventDescriptor) => {
			const	prevValue		= eventDescriptor.getPreviousValue().toJS(),
					currentValue	= eventDescriptor.getCurrentValue().toJS();
			
			if (prevValue.mode === 'closing' && currentValue.mode === 'general') {
				const 	binding 	= this.getDefaultBinding(),
						rivals		= binding.toJS('rivals.0');
				
				rivals.players.forEach(player => {
					const playerIndex = currentValue.model.results.individualScore.findIndex(individual => individual.userId === player.userId);
					if (playerIndex !== -1) {
						player.score = currentValue.model.results.individualScore[playerIndex].score;
					}
				});
				
				binding.set('rivals.0', Immutable.fromJS(rivals));
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
					extraScore: 0
				}
			};
			individualScoreArray.push(playerScoreData);
		}
		/** set score */
		playerScoreData.score = score.scoreAthletic.score;
		playerScoreData.richScore = Object.assign({}, {extraScore: score.scoreAthletic.extraScore});
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
			.set('selectedRivalIndex',	rivalIndex)
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
	renderRivals: function() {
		const binding = this.getDefaultBinding();

		const rivals = binding.toJS('rivals');

		const xmlRivals = [];
		let row = [];

		rivals.forEach((rival, rivalIndex) => {
			row.push(
				<Rival
					key										= { `rival_${rivalIndex}` }
					rivalIndex								= { rivalIndex }
					rival									= { rival }
					event									= { binding.toJS('model') }
					mode									= { binding.toJS('mode') }
					viewMode 								= { binding.toJS('view_mode') }
					onChangeScore							= { this.onChangeScore }
					onClickEditTeam							= { this.onClickEditTeam }
					onChangeIndividualScoreAvailable		= { this.onChangeIndividualScoreAvailable }
					handleClickOpponentSchoolManagerButton	= { this.handleClickOpponentSchoolManagerButton }
					isShowControlButtons					= { this.props.isShowControlButtons }
					activeSchoolId							= { this.props.activeSchoolId }
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

	onChangeCricketResult: function(result){
		const binding = this.getDefaultBinding();

		binding.set('model.results.cricketResult', Immutable.fromJS(result));
	},

	renderSelectWithGameResultForCricket: function(){
		const 	binding 	= this.getDefaultBinding(),
				sportName 	= typeof binding.toJS('model.sport.name') !== 'undefined' ? binding.toJS('model.sport.name').toLowerCase() : '',
				mode 		= typeof binding.toJS('mode') !== 'undefined' ? binding.toJS('mode') : '',
				event 		= binding.toJS('model');

		if (SportHelper.isCricket(sportName) && mode === 'closing') {
			return (
				<SelectForCricketWrapper
					event 			= { event }
					onChangeResult 	= { this.onChangeCricketResult }
				/>
			);
		} else {
			return null;
		}
	},
	
	renderGameResultForCricket: function(){
		const 	binding 	= this.getDefaultBinding(),
				mode 		= typeof binding.toJS('mode') !== 'undefined' ? binding.toJS('mode') : '',
				event 		= binding.toJS('model'),
				sportName 	= typeof binding.toJS('model.sport.name') !== 'undefined' ? binding.toJS('model.sport.name').toLowerCase() : '';

		if (SportHelper.isCricket(sportName) && mode === 'general') {
			return (
				<CricketResultBlock
					event 			= { event }
					activeSchoolId 	= { this.props.activeSchoolId }
				/>
			);
		} else {
			return null;
		}
	},
	
	render: function() {
		if(this.isSync()) {
			return (
				<div className="bRivals">
					{ this.renderSelectWithGameResultForCricket() }
					{ this.renderGameResultForCricket() }
					{ this.renderRivals() }
				</div>
			);
		} else {
			return null;
		}
	}
});

module.exports = Rivals;