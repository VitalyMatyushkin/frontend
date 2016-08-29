const	TeamPlayersValidator	= require('module/ui/managers/helpers/team_players_validator'),
		EventHelper				= require('module/helpers/eventHelper'),
		MoreartyHelper			= require('module/helpers/morearty_helper'),
		RoleHelper				= require('module/helpers/role_helper'),
		Lazy					= require('lazy.js'),
		Immutable				= require('immutable');

function isTeamEnableForEdit(activeSchoolId, event, team) {
	switch (event.eventType){
		case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
			return team.schoolId === activeSchoolId;
		default:
			return true;
	}
};

/**
 * Reduce available students ages for game from school object
 * @param schoolData
 * @returns {*}
 * @private
 */
function getAges(schoolData) {
	return schoolData.forms.reduce(function (memo, form) {
		if (memo.indexOf(form.age) === -1) {
			memo.push(form.age);
		}

		return memo;
	}, []);
};

/**
 * Validate player objects
 */
function validate(binding) {
	const sport = binding.toJS('teamForm.sportModel');

	if(sport) {
		const limits = {
			maxPlayers: sport.defaultLimits.maxPlayers,
			minPlayers: sport.defaultLimits.minPlayers,
			minSubs:    sport.defaultLimits.minSubs,
			maxSubs:    sport.defaultLimits.maxSubs
		};

		const result = TeamPlayersValidator.validate(
			binding.toJS('teamForm.___teamManagerBinding.teamStudents'),
			limits
		);

		binding.set('teamForm.error',
			Immutable.fromJS(result)
		);
	}
};

/**
 * FOR EACH PLAYER: Method search user by userId from player and return updated user with players info.
 * That need for team manager element.
 * @param users
 * @param players
 * @returns [user + player info]
 */
function getPlayersWithUserInfo(players, users) {
	return players.map( player => {
		const foundUser = Lazy(users).findWhere({id: player.userId});

		return Object.assign(
			{},
			foundUser,
			{
				position:		player.position,
				sub:			player.sub,
				playerModelId:	player._id,
				teamId:			player.teamId
			}
		);
	});
};

function commitIndividualPlayers(schoolId, eventId, initialPlayers, players) {
	const self = this;

	const promises = [];

	initialPlayers.forEach(initialPlayer =>
		// If player wasn't find - add delete promise to promise array
		!Lazy(players).findWhere({id:initialPlayer.id}) &&
		promises.push(
			self.deleteIndividualPlayer(
				schoolId,
				eventId,
				initialPlayer.id
			)
		)
	);

	// Add new player promises to promise array.
	// A little trick:
	// user without userId - is a new user.
	players.forEach(p => !p.userId && promises.push( self.addIndividualPlayer(schoolId, eventId, p) ));

	return promises;
};

function addIndividualPlayer(schoolId, eventId, player) {
	return window.Server.schoolEventIndividuals.post(
		{
			schoolId:	schoolId,
			eventId:	eventId
		}, {
			userId:			player.id,
			permissionId:	player.permissionId
		}
	);
};

function deleteIndividualPlayer(schoolId, eventId, individualId) {
	return window.Server.schoolEventIndividual.delete({
		schoolId:		schoolId,
		eventId:		eventId,
		individualId:	individualId
	});
};

function commitPlayers(initialPlayers, players, teamId, schoolId) {
	let promises = [];

	promises = promises.concat(initialPlayers.map((initialPlayer) => {
		let foundPlayer = players.find(p => p.id === initialPlayer.id);

		if(foundPlayer) {
			//Mmm, check for modifications
			let changes = {};
			if(foundPlayer.positionId !== initialPlayer.positionId) {
				changes.positionId = foundPlayer.positionId;
			}
			if(foundPlayer.sub !== initialPlayer.sub) {
				changes.sub = foundPlayer.sub;
			}

			if(changes.positionId !== undefined || changes.sub !== undefined) {
				return changePlayer(
						schoolId,
						teamId,
						initialPlayer.id,
						changes
					);
			}
		} else {
			//So, user delete player, let's delete player from server
			return deletePlayer(
					schoolId,
					teamId,
					initialPlayer.id
				);
		}
	})).filter(p => p !== undefined);

	// Add new player promises to promise array.
	// A little trick:
	// user without userId - is a new user.
	promises = promises.concat(players.filter(p => !p.userId).map(player => addPlayer(schoolId, teamId, player)).filter(p => p !== undefined));

	return promises;
};

function addPlayer(schoolId, teamId, player) {
	return window.Server.teamPlayers.post(
		{
			schoolId:  schoolId,
			teamId:     teamId
		},
		getBodyForAddPlayersRequest(player)
	);
};

function deletePlayer(schoolId, teamId, playerId) {
	return window.Server.teamPlayer.delete({
		schoolId:   schoolId,
		teamId:     teamId,
		playerId:   playerId
	});
};

function changePlayer(schoolId, teamId, playerId, changes) {
	return window.Server.teamPlayer.put(
		{
			schoolId:   schoolId,
			teamId:     teamId,
			playerId:   playerId
		},
		changes
	);
};

function convertGenderToServerValue(gender) {
	switch (gender) {
		case 'maleOnly':
			return 'MALE_ONLY';
		case 'femaleOnly':
			return 'FEMALE_ONLY';
		case 'mixed':
			return 'MIXED';
	}
}

function getBodyForAddPlayersRequest(player) {
	const body = {
		userId:         player.userId ? player.userId : player.id,
		permissionId:   player.permissionId
	};

	player.positionId	&&	(body.positionId = player.positionId);
	player.sub 			&&	(body.sub = player.sub);

	return body;
};

/**
 * Method inject form data to each player
 * Method required until on the server becomes available "include" functional
 */
function injectFormsToPlayers(players, forms) {
	const playersWithForms = [];

	players.forEach(player => {
		const form = Lazy(forms).findWhere( { id: player.formId } );
		const tempPlayer = Object.assign({}, player);

		tempPlayer.form = form;

		playersWithForms.push(tempPlayer);
	});

	return playersWithForms;
};

/**
 * Inject teamId to players
 * @param teamId
 * @param players
 * @returns {Array}
 */
function injectTeamIdToPlayers(teamId, players) {
	return players.map(player => Object.assign({}, player, {teamId: teamId}));
};

/**
 * Search sport by sportId in sport array and return it.
 * @param sportId - current sport id
 * @param sports - sports array
 * @returns found sport
 */
function getSportById(sportId, sports) {
	return Lazy(sports).findWhere({id: sportId});
};

/**
 * Convert server points model to client points model
 * Server points model [userId:{score, teamId}, userId:{score, teamId},...] - hash map
 * Client points model [{userId, score, teamId}, {userId, score, teamId}] - array
 */
function convertPointsToClientModel(serverPointsModel) {
	const clientPointsModel = [];

	for(let key in serverPointsModel) {
		clientPointsModel.push(
			Object.assign({}, serverPointsModel[key], {userId: key})
		);
	}

	return clientPointsModel;
};

function getFilterGender(gender) {
	switch (gender) {
		case 'maleOnly':
			return ['MALE'];
		case 'femaleOnly':
			return ['FEMALE'];
		case 'mixed':
			return ['MALE', 'FEMALE'];
		default:
			return [];
	}
};

function getTeamManagerSearchFilter(school, ages, gender, houseId) {
	const self = this;

	return {
		genders:		gender,
		houseId:		houseId ? houseId : undefined,
		schoolId:		school.id,
		forms:			self.getSchoolFormsFilteredByAges(
							ages,
							school.forms
						)
	}
};

function getSchoolFormsFilteredByAges(ages, schoolForms) {
	return schoolForms.filter(form => ages.indexOf(parseInt(form.age)) !== -1 || ages.indexOf(String(form.age)) !== -1);
};

function convertPlayersToServerValue(players) {
	return players.map(p => this.getBodyForAddPlayersRequest(p));
};

function isInterSchoolsEventForNonTeamSport(event) {
	if (typeof event !== 'undefined') {
		const self = this;

		return EventHelper.isInterSchoolsEvent(event) && self.isNonTeamSport(event);
	}
};

function isHousesEventForNonTeamSport(event) {
	if (typeof event !== 'undefined') {
		const self = this;

		return EventHelper.isHousesEvent(event) && self.isNonTeamSport(event);
	}
};

function isHousesEventForTeamSport(event) {
	if (typeof event !== 'undefined') {
		const self = this;

		return EventHelper.isHousesEvent(event) && self.isTeamSport(event);
	}
};

function isInternalEventForOneOnOneSport(event) {
	if (typeof event !== 'undefined') {
		const self = this;

		return EventHelper.isInternalEvent(event) && self.isOneOnOneSport(event);
	}
};

function isInternalEventForIndividualSport(event) {
	if(typeof event !== 'undefined') {
		const self = this;

		const eventType = event.eventType ?
			EventHelper.serverEventTypeToClientEventTypeMapping[event.eventType] :
			event.type;

		return (eventType === 'internal') && self.isIndividualSport(event);
	}
};

function isInternalEventForTeamSport(event) {
	if(typeof event !== 'undefined') {
		const self = this;

		return EventHelper.isInternalEvent(event) && self.isTeamSport(event);
	}
};


function isInterSchoolsEventForTeamSport(event) {
	if(typeof event !== 'undefined') {
		const self = this;

		return EventHelper.isInterSchoolsEvent(event) && self.isTeamSport(event);
	}
};

function isInterSchoolsEventForIndividualSport(event) {
	if(typeof event !== 'undefined') {
		const self = this;

		const eventType = event.eventType ?
			EventHelper.serverEventTypeToClientEventTypeMapping[event.eventType] :
			event.type;

		return (eventType === 'inter-schools') && self.isIndividualSport(event);
	}
};

function isInterSchoolsEventForOneOnOneSport(event) {
	if(typeof event !== 'undefined') {
		const self = this;

		const eventType = event.eventType ?
			EventHelper.serverEventTypeToClientEventTypeMapping[event.eventType] :
			event.type;

		return (eventType === 'inter-schools') && self.isOneOnOneSport(event);
	}
};

function isNonTeamSport(event) {
	if(typeof event !== 'undefined') {
		const sport = event.sportModel ? event.sportModel : event.sport;

		return sport.players === 'INDIVIDUAL' || sport.players === '1X1';
	}
};

function isTeamSport(event) {
	if(typeof event !== 'undefined') {
		const sport = event.sportModel ? event.sportModel : event.sport;

		return sport.players === 'TEAM' || sport.players === '2X2';
	}
};

function isIndividualSport(event) {
	if(typeof event !== 'undefined') {
		const sport = event.sportModel ? event.sportModel : event.sport;

		return sport.players === 'INDIVIDUAL';
	}
};

function isOneOnOneSport(event) {
	if(typeof event !== 'undefined') {
		const sport = event.sportModel ? event.sportModel : event.sport;

		return sport.players === '1X1';
	}
};

function isTeamDataCorrect(event, validationData) {
	const	self	= this;

	let isError = false;

	// for inter-schools event we can edit only one team - our team:)
	if(self.getEventType(event) === 'inter-schools' || EventHelper.isEventWithOneIndividualTeam(event)) {
		isError = validationData[0].isError;
	} else {
		isError = !(!validationData[0].isError && !validationData[1].isError);
	}

	return !isError;
};
/**
 * Return TRUE if participants count is two and event isn't close.
 * Note: participants count can be equal one, if event is "inter-schools" and opponent school
 * has not yet accepted invitation.
 * @returns {boolean}
 * @private
 */
function isShowCloseEventButton(thiz) {
	const	self	= this,
			binding	= thiz.getDefaultBinding();

	const event = binding.toJS('model');

	return binding.toJS('model.status') === "ACCEPTED" &&
		(
			self.isInterSchoolsEventForNonTeamSport(event) ?
				(
					self.isSchoolHaveIndividualPlayers(event, event.inviterSchool.id) &&
					self.isSchoolHaveIndividualPlayers(event, event.invitedSchools[0].id)
				)
				: true
		) &&
		(
			self.isHousesEventForNonTeamSport(event) ?
				self.isHouseHaveIndividualPlayers(event, event.housesData[0].id) &&
				self.isHouseHaveIndividualPlayers(event, event.housesData[1].id)
				: true
		) &&
		( self.isInternalEventForTeamSport(event) ? event.teamsData.length === 2 : true ) &&
		( self.isInternalEventForOneOnOneSport(event) ? event.individualsData.length === 2 : true ) &&
		EventHelper.isGeneralMode(binding) &&
		RoleHelper.isUserSchoolWorker(thiz);
};

/**
 * Return TRUE if event edit mode is "general".
 * @returns {boolean}
 * @private
 */
function isShowEditEventButton(thiz) {
	const	self	= this,
			binding	= thiz.getDefaultBinding();

	return EventHelper.isNotFinishedEvent(binding) &&
		binding.get('mode') === 'general' &&
		binding.get('activeTab') === 'teams' &&
		RoleHelper.isUserSchoolWorker(thiz);
};

function isSchoolHaveIndividualPlayers(event, schoolId) {
	return event.individualsData.filter(i => i.schoolId === schoolId).length > 0;
};

function isHouseHaveIndividualPlayers(event, houseId) {
	return event.individualsData.filter(i => i.houseId === houseId).length > 0;
};

function callFunctionForLeftContext(activeSchoolId, event, cb) {
	const self = this;

	const	eventType	= event.eventType,
			teamBundles	= self.getTeamBundles(event),
			schoolsData	= teamBundles.schoolsData,
			housesData	= teamBundles.housesData,
			teamsData	= teamBundles.teamsData;

	switch(eventType) {
		case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
			if(teamsData.length === 0) {
				// Render 'active school' on the left.
				return cb(
					'schoolsData',
					schoolsData[0].id === activeSchoolId ? 0 : 1
				);
			} else if (teamsData.length === 1) {
				// Render 'active school' on the left.
				// Check - Has 'active school' team?
				// If not - send order from schoolsData
				// If yes - send order from teamsData
				if(teamsData[0].schoolId === activeSchoolId) {
					return cb('teamsData', 0);
				} else {
					return cb(
						'schoolsData',
						schoolsData[0].id === activeSchoolId ? 0 : 1
					);
				}
			} else if(teamsData.length === 2) {
				return cb(
					'teamsData',
					teamsData[0].schoolId === activeSchoolId ? 0 : 1
				);
			}
			break;
		case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
			if(teamsData.length === 0) {
				return cb('housesData', 0);
			} else if (
				teamsData.length === 1 ||
				teamsData.length === 2
			) {
				return cb('teamsData', 0);
			}
			break;
		case EventHelper.clientEventTypeToServerClientTypeMapping['internal']:
			return cb('teamsData', 0);
	}
};

function callFunctionForRightContext(activeSchoolId, event, cb) {
	const self = this;

	const	eventType	= event.eventType,
			teamBundles	= self.getTeamBundles(event),
			schoolsData	= teamBundles.schoolsData,
			housesData	= teamBundles.housesData,
			teamsData	= teamBundles.teamsData;

	switch(eventType) {
		case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
			if(teamsData.length === 0) {
				// render 'not active school' on the left.
				return cb(
					'schoolsData',
					schoolsData[0].id !== activeSchoolId ? 0 : 1
				);
			} else if (teamsData.length === 1) {
				// render 'not active school' on the right
				// check - Has 'not active school' team?
				// if not - send order from schoolsData
				// if yes - send order from teamsData
				if(teamsData[0].schoolId !== activeSchoolId) {
					return cb('teamsData', 0);
				} else {
					return cb(
						'schoolsData',
						schoolsData[0].id !== activeSchoolId ? 0 : 1
					);
				}
			} else if(teamsData.length === 2) {
				return cb(
					'teamsData',
					teamsData[0].schoolId !== activeSchoolId ? 0 : 1
				);
			}
			break;
		case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
			if(teamsData.length === 0) {
				return cb('housesData', 1);
			} else if (teamsData.length === 1) {
				return cb(
					'housesData',
					teamsData[0].id === housesData[0].id ? 0 : 1
				);
			} if(teamsData.length === 2) {
			return cb('teamsData', 1);
		}
			break;
		case EventHelper.clientEventTypeToServerClientTypeMapping['internal']:
			return cb('teamsData', 1);
	}
};

function getCountPoints(event, teamBundleName, order) {
	const self = this;

	let	scoreBundleName,
		idFieldName;

	switch (teamBundleName) {
		case 'schoolsData':
			scoreBundleName	= 'schoolScore';
			idFieldName		= 'schoolId';
			break;
		case 'housesData':
			scoreBundleName	= 'houseScore';
			idFieldName		= 'houseId';
			break;
		case 'teamsData':
			scoreBundleName	= 'teamScore';
			idFieldName		= 'teamId';
			break;
	}

	const	teamBundles	= self.getTeamBundles(event),
			dataBundle	= teamBundles[teamBundleName],
			scoreData	= event.results[scoreBundleName].find(r => r[idFieldName] === dataBundle[order].id);

	let points = 0;
	if(typeof scoreData !== 'undefined') {
		points = scoreData.score;
	}

	return points;
}

function getSchoolsData(event) {
	const schoolsDara = [];

	schoolsDara.push(event.inviterSchool);
	event.invitedSchools.forEach((s) => {
		schoolsDara.push(s);
	});

	return schoolsDara;
};

function getTeamBundles(event) {
	const self = this;

	return {
				schoolsData:	self.getSchoolsData(event),
				housesData:		event.housesData,
				teamsData:		event.teamsData
			};
};

/**
 * Create teams for TeamManager.
 * @returns {*}
 */
function createTeams(schoolId, event, rivals, teamWrappers) {
	const self = this;

	// For inter school event create team only for only one rival - active school
	// There are two situations:
	// 1) Create inter-schools event - create team only for inviter school
	// 2) Acceptation event - create team for invited school
	let _rivals;
	if(
		EventHelper.isInterSchoolsEvent(event)) {
		_rivals = [ rivals.find(r => r.id === schoolId) ];
	} else {
		_rivals = rivals;
	}

	return _rivals
		.filter((_, i) => {
			const teamWrapper = teamWrappers[i];

			return !teamWrapper.isSetTeamLater;
		})
		.map((rival, i) => self.createTeam(schoolId, event, rival, teamWrappers[i]));
};

function createTeam(schoolId, event, rival, teamWrapper) {
	const self = this;

	const teamBody = {};
	switch (self.getTypeOfNewTeam(teamWrapper)) {
		case "CLONE":
			teamBody.name		= teamWrapper.teamName.name;
			teamBody.players	= teamWrapper.___teamManagerBinding.teamStudents;

			return self.createTeamByPrototype(
				teamWrapper.selectedTeam,
				teamBody
			);
		case "ADHOC":
			teamBody.name			= teamWrapper.teamName.name;
			teamBody.ages			= event.ages;
			teamBody.gender			= TeamHelper.convertGenderToServerValue(event.gender);
			teamBody.sportId		= event.sportId;
			teamBody.schoolId		=schoolId;
			teamBody.players		= TeamHelper.convertPlayersToServerValue(teamWrapper.___teamManagerBinding.teamStudents);
			teamBody.teamType		= "ADHOC";
			self.getEventType(event) === 'houses' && (teamBody.houseId = rival.id);

			return self.createAdhocTeam(teamBody);
	}
};

function getTypeOfNewTeam(teamWrapper) {
	if(teamWrapper.selectedTeam) {
		return "CLONE";
	} else {
		return "ADHOC";
	}
};

function createTeamByPrototype(prototype, teamBody) {
	return window.Server.cloneTeam.post(
		{
			schoolId:	prototype.schoolId,
			teamId:		prototype.id
		}
		)
		.then(team => {
			return window.Server.team.put(
				{
					schoolId:	team.schoolId,
					teamId:		team.id
				}, {
					name:		teamBody.name,
					players:	TeamHelper.convertPlayersToServerValue(teamBody.players)
				}
			)
		});
};

function updateTeam(schoolId, teamId, body) {
	return window.Server.team.put({
		schoolId: schoolId,
		teamId: teamId
	}, body);
};

function createAdhocTeam(body) {
	return window.Server.teamsBySchoolId.post(body.schoolId, body);
};

function deleteTeamFromEvent(schoolId, eventId, teamId) {
	return window.Server.schoolEventTeam.delete({
		schoolId:	schoolId,
		eventId:		eventId,
		teamId:		teamId
	});
};

function addIndividualPlayersToEvent(schoolId, event, teamWrapper) {
	const players = teamWrapper.reduce(
		(players, teamWrapper) => players.concat(teamWrapper.___teamManagerBinding.teamStudents),
		[]
	);

	return window.Server.schoolEventIndividualsBatch.post(
		{
			schoolId:	schoolId,
			eventId:	event.id
		},
		{
			individuals: players.map(p => {
				return {
					userId:			p.id,
					permissionId:	p.permissionId
				};
			})
		}
	);
};

function addTeamsToEvent(schoolId, event, teams) {
	return Promise.all(teams.map(t => window.Server.schoolEventTeams.post(
		{
			schoolId:	schoolId,
			eventId:	event.id
		}, {
			teamId:		t.id
		}
	)));
};

function getEventType(event) {
	if(event.type) {
		return event.type;
	} else {
		return EventHelper.serverEventTypeToClientEventTypeMapping[event.eventType];
	}
};

const TeamHelper = {
	getAges:								getAges,
	validate:								validate,
	getSportById:							getSportById,
	getPlayersWithUserInfo:					getPlayersWithUserInfo,
	addPlayer:								addPlayer,
	changePlayer:							changePlayer,
	deletePlayer:							deletePlayer,
	commitPlayers:							commitPlayers,
	commitIndividualPlayers:				commitIndividualPlayers,
	injectFormsToPlayers:					injectFormsToPlayers,
	injectTeamIdToPlayers:					injectTeamIdToPlayers,
	isTeamEnableForEdit:					isTeamEnableForEdit,
	convertPointsToClientModel:				convertPointsToClientModel,
	convertPlayersToServerValue:			convertPlayersToServerValue,
	convertGenderToServerValue:				convertGenderToServerValue,
	getBodyForAddPlayersRequest:			getBodyForAddPlayersRequest,
	getFilterGender:						getFilterGender,
	isIndividualSport:						isIndividualSport,
	getTeamManagerSearchFilter:				getTeamManagerSearchFilter,
	getSchoolFormsFilteredByAges:			getSchoolFormsFilteredByAges,
	addIndividualPlayer:					addIndividualPlayer,
	deleteIndividualPlayer:					deleteIndividualPlayer,
	isOneOnOneSport:						isOneOnOneSport,
	isNonTeamSport:							isNonTeamSport,
	isInterSchoolsEventForNonTeamSport:		isInterSchoolsEventForNonTeamSport,
	isHousesEventForTeamSport:				isHousesEventForTeamSport,
	isHousesEventForNonTeamSport:			isHousesEventForNonTeamSport,
	isInternalEventForOneOnOneSport:		isInternalEventForOneOnOneSport,
	isInternalEventForIndividualSport:		isInternalEventForIndividualSport,
	isInternalEventForTeamSport:			isInternalEventForTeamSport,
	isInterSchoolsEventForTeamSport:		isInterSchoolsEventForTeamSport,
	isInterSchoolsEventForIndividualSport:	isInterSchoolsEventForIndividualSport,
	isInterSchoolsEventForOneOnOneSport:	isInterSchoolsEventForOneOnOneSport,
	isTeamDataCorrect:						isTeamDataCorrect,
	isTeamSport:							isTeamSport,
	isShowEditEventButton:					isShowEditEventButton,
	isShowCloseEventButton:					isShowCloseEventButton,
	isSchoolHaveIndividualPlayers:			isSchoolHaveIndividualPlayers,
	isHouseHaveIndividualPlayers:			isHouseHaveIndividualPlayers,
	callFunctionForRightContext:			callFunctionForRightContext,
	callFunctionForLeftContext:				callFunctionForLeftContext,
	getCountPoints:							getCountPoints,
	getSchoolsData:							getSchoolsData,
	getTeamBundles:							getTeamBundles,
	createTeams:							createTeams,
	getTypeOfNewTeam:						getTypeOfNewTeam,
	createTeamByPrototype:					createTeamByPrototype,
	createAdhocTeam:						createAdhocTeam,
	createTeam:								createTeam,
	deleteTeamFromEvent:					deleteTeamFromEvent,
	addTeamsToEvent:						addTeamsToEvent,
	addIndividualPlayersToEvent:			addIndividualPlayersToEvent,
	getEventType:							getEventType,
	updateTeam:								updateTeam
};

module.exports = TeamHelper;