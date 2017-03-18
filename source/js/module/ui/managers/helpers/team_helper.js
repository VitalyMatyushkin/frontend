const	TeamPlayersValidator	= require('module/ui/managers/helpers/team_players_validator'),
		EventHelper				= require('module/helpers/eventHelper'),
		MoreartyHelper			= require('module/helpers/morearty_helper'),
		RoleHelper				= require('module/helpers/role_helper'),
		SportConsts				= require('module/helpers/consts/sport'),
		propz					= require('propz'),
		Lazy					= require('lazy.js'),
		Promise 				= require('bluebird'),
		Immutable				= require('immutable');

const OPERATION_TYPE = 	{
							plus:'plus',
							minus:'minus'
						};

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
	return schoolData.forms
		.reduce((memo, form) => {
			if (memo.indexOf(form.age) === -1) {
				memo.push(form.age);
			}

			return memo;
		}, [])
		.sort((a, b) => a - b);
};

/**
 * Validate player objects
 */
function validate(binding) {
	const sport = binding.toJS('teamForm.sportModel');

	if(
		typeof sport !== 'undefined' &&
		typeof sport.defaultLimits !== 'undefined'
	) {

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
			if(foundPlayer.isCaptain !== initialPlayer.isCaptain) {
				changes.isCaptain = foundPlayer.isCaptain;
			}

			if(changes.positionId !== undefined || changes.sub !== undefined || changes.isCaptain !== undefined) {
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
		// it doesn't convert gender value if gender value has server type
		case 'MALE_ONLY':
		case 'FEMALE_ONLY':
		case 'MIXED':
			return gender;
	}
}

function getBodyForAddPlayersRequest(player) {
	// User Id may be contained in userId field or in id.
	// Because manager component gets users from different sources
	const body = {
		userId			: player.userId ? player.userId : player.id,
		permissionId	: player.permissionId,
		isCaptain 		: typeof player.isCaptain !== 'undefined' ? player.isCaptain : false
	};

	if (typeof player.positionId !=='undefined') {
		body.positionId = player.positionId
	}
	
	if (typeof player.sub !== 'undefined') {
		body.sub = player.sub
	}

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

function getFilterGender(gender) {
	switch (gender) {
		case 'maleOnly':
		case 'MALE_ONLY':
			return ['MALE'];
		case 'femaleOnly':
		case 'FEMALE_ONLY':
			return ['FEMALE'];
		case 'mixed':
		case 'MIXED':
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

function isHousesEventForIndividualSport(event) {
	if(typeof event !== 'undefined') {
		const self = this;

		const eventType = event.eventType ?
			EventHelper.serverEventTypeToClientEventTypeMapping[event.eventType] :
			event.type;

		return (eventType === 'houses') && self.isIndividualSport(event);
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
}

/** Check if sport is INDIVIDUAL or 1X1
 * @param event
 * @returns {boolean}
 */
function isNonTeamSport(event) {
	if(typeof event !== 'undefined') {
		const sport = event.sportModel ? event.sportModel : event.sport;

		return sport.players === 'INDIVIDUAL' || sport.players === '1X1';
	}
}

/** Checking if event's sport is TEAM or 2x2 */
function isTeamSport(event) {
	if(typeof event !== 'undefined') {
		const sport = event.sportModel ? event.sportModel : event.sport;

		return sport && (sport.players === SportConsts.SPORT_PLAYERS.TEAM || sport.players === SportConsts.SPORT_PLAYERS['2X2']);
	} else {
		return false;
	}
}

function isIndividualSport(event) {
	if(typeof event !== 'undefined') {
		const sport = event.sportModel ? event.sportModel : event.sport;

		return sport.players === SportConsts.SPORT_PLAYERS.INDIVIDUAL;
	} else {
		return false;
	}
}

function isOneOnOneSport(event) {
	if(typeof event !== 'undefined') {
		const sport = event.sportModel ? event.sportModel : event.sport;

		return sport.players === SportConsts.SPORT_PLAYERS['1X1'];
	} else
		return false;
}

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
}
/**
 * Return TRUE if participants count is two and event isn't close.
 * Note: participants count can be equal one, if event is "inter-schools" and opponent school
 * has not yet accepted invitation.
 * @returns {boolean}
 * @private
 */
function isShowScoreEventButtonsBlock(thiz) {
	const	self	= this,
			binding	= thiz.getDefaultBinding();

	const event = binding.toJS('model');

	return (
			self.isInterSchoolsEventForIndividualSport(event) ?
				(
					self.isSchoolHaveIndividualPlayers(event, event.inviterSchool.id) &&
					self.isSchoolHaveIndividualPlayers(event, event.invitedSchools[0].id)
				)
				: true
		) && (
			self.isHousesEventForIndividualSport(event) ?
				self.isHouseHaveIndividualPlayers(event, event.housesData[0].id) &&
				self.isHouseHaveIndividualPlayers(event, event.housesData[1].id)
				: true
		) &&
		( self.isInternalEventForTeamSport(event) ? event.teamsData.length === 2 : true ) &&
		( self.isInternalEventForOneOnOneSport(event) ? event.individualsData.length === 2 : true );
}

/**
 * Return TRUE if event edit mode is "general".
 * @returns {boolean}
 * @private
 */
function isShowEditEventButton(thiz) {
	const	self	= this,
			binding	= thiz.getDefaultBinding();

	return EventHelper.isNotFinishedEventByBinding(binding) &&
		binding.get('mode') === 'general' &&
		RoleHelper.isUserSchoolWorker(thiz);
}

function isSchoolHaveIndividualPlayers(event, schoolId) {
	return event.individualsData.filter(i => i.schoolId === schoolId).length > 0;
}

function isHouseHaveIndividualPlayers(event, houseId) {
	return event.individualsData.filter(i => i.houseId === houseId).length > 0;
}

/**
 * Get rival info for left or right context
 * @private
 * @param {object} event - event object
 * @param {string} activeSchoolId - activeSchoolId
 * @param {boolean} forLeftContext - calculate for left context (true - left, false - right)
 * @returns {object} result - rival info
 * 			{string} result.name - name team or player
 * 			{string} result.from - from school or house name
 * 			{string} result.schoolPic - school emblem
 * 			{string} result.value - the combination of the 'name' and 'from'. Depending on the context(left, right),
 * 				the type of sport and the presence of an active school ID.
 *
 * */
function getRival(event, activeSchoolId, forLeftContext){
	const	teamBundles			= getTeamBundles(event),			// houseData + schoolData + teams in one object...
			schoolsData			= teamBundles.schoolsData,
			housesData			= teamBundles.housesData,
			teamsData			= teamBundles.teamsData,
			individData 		= event.individualsData,
			isTeam 				= isTeamSport(event),				// include TEAM and 2x2
			isOneOnOne 			= isOneOnOneSport(event),
			isIndividual 		= isIndividualSport(event),
			index 				= forLeftContext ? 0 : 1,
			isInterSchoolsEvent = EventHelper.isInterSchoolsEvent(event),
			isHousesEvent 		= EventHelper.isHousesEvent(event),
			isInternalEvent 	= EventHelper.isInternalEvent(event);

	let name = '',
		from = '',
		school,
		team, student;

	/**get rival name (team or student)*/
	switch(true){
		case isTeam:
			if(activeSchoolId && isInterSchoolsEvent){
				team = forLeftContext ? teamsData.find(t => t.schoolId === activeSchoolId)
					: teamsData.find(t => t.schoolId !== activeSchoolId);
			} else{
				team = index < teamsData.length ? teamsData[index] : null;
			}
			name = team ? team.name : '';
			break;
		case isOneOnOne:
			if(activeSchoolId && isInterSchoolsEvent){
				student = forLeftContext ? individData.find(t => t.schoolId === activeSchoolId)
					: individData.find(t => t.schoolId !== activeSchoolId);
			} else{
				student = index < individData.length ? individData[index] : null;
			}
			name = student ? student.firstName + ' ' + student.lastName : '';
			break;
		case isIndividual:
			/**not set name for individual sport type*/
			break;
	}

	/**get rival 'from' (school or house)*/
	switch (true){
		case isInterSchoolsEvent:
			if(activeSchoolId){
				school = forLeftContext ? schoolsData.find(s => s.id === activeSchoolId)
					: schoolsData.find(s => s.id !== activeSchoolId);
			} else{
				school = index < schoolsData.length ? schoolsData[index] : null;
			}
			from = school ? school.name : '';
			break;
		case isHousesEvent:
			let house, houseId;
			switch(true){
				case isTeam:
					houseId = team && team.houseId;
					if(!houseId){
						houseId = teamsData.length > 0 ? event.houses.find(id => id !== teamsData[0].houseId) : null;
					}
					break;
				case isOneOnOne:
					houseId = student && student.houseId;
					if(!houseId){
						houseId = individData.length > 0 ? event.houses.find(id => id !== individData[0].houseId) : null;
					}
					break;
			}
			house = houseId ? housesData.find(h => h && h.id === houseId) : housesData[index];
			from = house ? house.name : '';
			break;
		case isInternalEvent:
			from = isIndividual ? 'individual':	schoolsData.length ? schoolsData[0].name : 'n/a';
			break;
	}

	const 	onlyFrom = !name || isIndividual,
			onlyName = activeSchoolId && (forLeftContext && isInterSchoolsEvent || isInternalEvent);

	return {
		name:name,
		from:from,
		schoolPic: school ? school.pic : schoolsData.length ? schoolsData[0].pic : null,
		value: onlyFrom ? from : onlyName ? name : `${name} [${from}]`
	};
}
function getRivalForLeftContext(event, activeSchoolId){
	return getRival(event, activeSchoolId, true);
}
function getRivalForRightContext(event, activeSchoolId){
	return getRival(event, activeSchoolId, false);
}
function getParametersForLeftContext(activeSchoolId, event){
	return this.callFunctionForLeftContext(activeSchoolId, event, (bundleName, order) => {
		return {
			bundleName: bundleName,
			order: order
		}
	});
}
function getParametersForRightContext(activeSchoolId, event){
	return this.callFunctionForRightContext(activeSchoolId, event, (bundleName, order) => {
		return {
			bundleName: bundleName,
			order: order
		}
	});
}
function callFunctionForLeftContext(activeSchoolId, event, cb) {
	const self = this;

	const	eventType	= event.eventType,
			teamBundles	= self.getTeamBundles(event),
			schoolsData	= teamBundles.schoolsData,
			housesData	= teamBundles.housesData,
			teamsData	= teamBundles.teamsData;

	switch(eventType) {
		case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
			if(TeamHelper.isOneOnOneSport(event)) {
				if(event.individualsData.length === 0) {
					// Render 'active school' on the left.
					return cb(
						'schoolsData',
						schoolsData[0].id === activeSchoolId ? 0 : 1
					);
				} else if(event.individualsData.length === 1) {
					// Render 'active school' on the left.
					// Check - 'active school' has player?
					// If not - send order from schoolsData
					// If yes - send order from individualsData
					if(event.individualsData[0].schoolId === activeSchoolId) {
						return cb('individualsData', 0);
					} else {
						return cb(
							'schoolsData',
							schoolsData[0].id === activeSchoolId ? 0 : 1
						);
					}
				} else if(event.individualsData.length === 2) {
					return cb(
						'individualsData',
						event.individualsData[0].schoolId === activeSchoolId ? 0 : 1
					);
				}
			} else if (TeamHelper.isTeamSport(event)) {
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
				} else {
					return cb(
						'teamsData',
						teamsData[0].schoolId === activeSchoolId ? 0 : 1
					);
				}
			}
			break;
		case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
			if(TeamHelper.isOneOnOneSport(event)) {
				if(event.individualsData.length === 0) {
					// Render 'active school' on the left.
					return cb('housesData', 0);
				} else if(
					event.individualsData.length === 1 ||
					event.individualsData.length === 2
				) {
					return cb('individualsData', 0);
				}
			} else if(TeamHelper.isTeamSport(event)) {
				// for team sport show house[0] or team for house[0] on left side - ALWAYS!
				if(teamsData.length === 0) {
					return cb('housesData', 0);
				} else if (teamsData.length === 1) {
					const foundIndex = teamsData.findIndex(t => t.houseId === housesData[0].id);
					if(foundIndex !== -1) {
						return cb('teamsData', foundIndex);
					} else {
						return cb('housesData', 0);
					}
				} else if (teamsData.length === 2) {
					let foundIndex = teamsData.findIndex(t => t.houseId === housesData[0].id);
					if(foundIndex !== -1) {
						return cb('teamsData', foundIndex);
					} else {
						console.error('No team for house! houseId: ' + housesData[0].id + ', event: ');
						console.info(event);
						foundIndex = teamsData.findIndex(t => t.houseId === housesData[1].id);
						if(foundIndex !== -1) {
							return cb('teamsData', 1-foundIndex);
						} else {
							return cb('teamsData', 0);
						}
					}
				}
			}
			break;
		case EventHelper.clientEventTypeToServerClientTypeMapping['internal']:
			if(TeamHelper.isTeamSport(event)){
				return cb('teamsData', 0);
			}
			return cb('individualsData', 0);
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
			if(TeamHelper.isOneOnOneSport(event)) {
				if(event.individualsData.length === 0) {
					// Render 'active school' on the left.
					return cb(
						'schoolsData',
						schoolsData[0].id !== activeSchoolId ? 0 : 1
					);
				} else if(event.individualsData.length === 1) {
					// Render 'active school' on the left.
					// Check - 'active school' has player?
					// If not - send order from schoolsData
					// If yes - send order from individualsData
					if(event.individualsData[0].schoolId !== activeSchoolId) {
						return cb('individualsData', 0);
					} else {
						return cb(
							'schoolsData',
							schoolsData[0].id !== activeSchoolId ? 0 : 1
						);
					}
				} else if(event.individualsData.length === 2) {
					return cb(
						'individualsData',
						event.individualsData[0].schoolId !== activeSchoolId ? 0 : 1
					);
				}
			} else if(teamsData.length === 0) {
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
			} else {
				return cb(
					'teamsData',
					teamsData[0].schoolId !== activeSchoolId ? 0 : 1
				);
			}
			break;
		case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
			if(TeamHelper.isOneOnOneSport(event)) {
				if(event.individualsData.length === 0) {
					// Render 'active school' on the left.
					return cb('housesData', 1);
				} else if(event.individualsData.length === 1) {
					return cb(
						'housesData',
						event.individualsData[0].houseId === housesData[0].id ? 0 : 1
					);
				} else if(event.individualsData.length === 2) {
					return cb('individualsData', 1);
				}
			} else if(TeamHelper.isTeamSport(event)) {
				// for team sport show house[1] or team for house[1] on right side - ALWAYS!
				if(teamsData.length === 0) {
					return cb('housesData', 1);
				} else if (teamsData.length === 1) {
					const foundIndex = teamsData.findIndex(t => t.houseId === housesData[1].id);
					if(foundIndex !== -1) {
						return cb('teamsData', foundIndex);
					} else {
						return cb('housesData', 1);
					}
				} else if (teamsData.length === 2) {
					let foundIndex = teamsData.findIndex(t => t.houseId === housesData[1].id);
					if(foundIndex !== -1) {
						return cb('teamsData', foundIndex);
					} else {
						console.error('No team for house! houseId: ' + housesData[1].id + ', event: ');
						console.info(event);
						foundIndex = teamsData.findIndex(t => t.houseId === housesData[0].id);
						if(foundIndex !== -1) {
							return cb('teamsData', 1-foundIndex);
						} else {
							return cb('teamsData', 1);
						}
					}
				}
			}
			break;
		case EventHelper.clientEventTypeToServerClientTypeMapping['internal']:
			if(TeamHelper.isTeamSport(event)){
				return cb('teamsData', 1);
			}
			return cb('individualsData', 1);
	}
}

function getCountPoints(event, teamBundleName, order) {
	const	self		= this,
			teamBundles	= self.getTeamBundles(event);

	let	scoreBundleName,
		resultIdFieldName,
		dataBundleIdFieldName,
		dataBundle;

	switch (teamBundleName) {
		case 'schoolsData':
			scoreBundleName			= 'schoolScore';
			resultIdFieldName		= 'schoolId';
			dataBundleIdFieldName	= 'id';
			dataBundle				= teamBundles[teamBundleName];
			break;
		case 'housesData':
			scoreBundleName			= 'houseScore';
			resultIdFieldName		= 'houseId';
			dataBundleIdFieldName	= 'id';
			dataBundle				= teamBundles[teamBundleName];
			break;
		case 'teamsData':
			scoreBundleName			= 'teamScore';
			resultIdFieldName		= 'teamId';
			dataBundleIdFieldName	= 'id';
			dataBundle				= teamBundles[teamBundleName];
			break;
		case 'individualsData':
			scoreBundleName			= 'individualScore';
			resultIdFieldName		= 'userId';
			dataBundleIdFieldName	= 'userId';
			dataBundle				= event.individualsData;
			break;
	}

	const scoreData = event.results[scoreBundleName].find(r => typeof dataBundle[order] !== "undefined" && r[resultIdFieldName] === dataBundle[order][dataBundleIdFieldName]);
	let points = 0;
	if(typeof scoreData !== 'undefined') {
		points = scoreData.score;
	}

	return points;
}

/**
 * Convert count points to extended result
 * @param {number} countPoints - count of points
 * @param {string} pointsType - type of points
 * @returns {object} result - extended result(points, distance or time info)
 * 			{string} result.str - string result (f.e. - '1km 346m 21cm')
 *			{number} result[km, m, cm, h, min, sec]
 * */
function convertPoints(countPoints, pointsType){
	const getTimeResult = function(countPoints) {
		const 	sec_in_hours 	= 3600,
				sec_in_min 		= 60,
				points 	= Math.floor(countPoints),
				ms 		= Math.round((countPoints - points)*1000),
				h 		= Math.floor(points / sec_in_hours),
				min		= Math.floor((points - h * sec_in_hours) / sec_in_min),
				sec		= points - h * sec_in_hours - min * sec_in_min;
		
		let str = '';

		str += h ? h + 'h ': '';
		str += min ? min + 'min ': '';
		str += sec || countPoints === 0 ? sec + 'sec ': '';
		str += ms ? ms + 'ms': '';

		return {
			h:h,
			min:min,
			sec:sec,
			ms:ms,
			str:str.trim()
		};
	},
	getDistanceResult = function(countPoints) {
		const	cm_in_km 	= 100000,
				cm_in_m 	= 100,
				km	= Math.floor(countPoints / cm_in_km),
				m	= Math.floor((countPoints - km * cm_in_km) / cm_in_m),
				cm	= countPoints - km * cm_in_km - m * cm_in_m;


		let str = '';

		str += km ? km + 'km ': '';
		str += m ? m + 'm ': '';
		str += cm || countPoints === 0 ? cm + 'cm': '';

		return {
			km:km,
			m:m,
			cm:cm,
			str:str.trim()
		};

	};
	let result;

	switch (pointsType) {
		case SportConsts.SPORT_POINTS_TYPE.PLAIN:
			result = {
				str:countPoints
			};
			break;
		case SportConsts.SPORT_POINTS_TYPE.TIME:
			result = getTimeResult(countPoints);
			break;
		case SportConsts.SPORT_POINTS_TYPE.DISTANCE:
			result = getDistanceResult(countPoints);
			break;
	}

	return result;
}

/** Return array of all schools taking part in event: `inviterSchool` + all 'invitedSchools' */
function getSchoolsData(event) {
	let schools = [];

	schools.push(event.inviterSchool);
	return schools.concat(event.invitedSchools.filter(school => school.id !== event.inviterSchoolId));
}

/** Return bundle with all schools participated in event data, all houses data and all teams data.
 *  I'm not sure (I'm not author) but I believe this method required for reviving teams: each team can be either
 *  school team or house team. So somewhere you will need school/house data for doing somewhat with teams
 * @param event
 * @returns {{schoolsData, housesData: *, teamsData: (*|Array)}}
 */
function getTeamBundles(event) {
	return {
		schoolsData:	getSchoolsData(event),
		housesData:		event.housesData,
		teamsData:		event.teamsData
	};
}

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

	return _rivals.map((rival, i) => {
		if(!teamWrappers[i].isSetTeamLater) {
			return self.createTeam(schoolId, event, rival, teamWrappers[i]);
		}
	}).filter(p => typeof p !== 'undefined');
}

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
			teamBody.schoolId		= schoolId;
			teamBody.players		= TeamHelper.convertPlayersToServerValue(teamWrapper.___teamManagerBinding.teamStudents);
			teamBody.teamType		= "ADHOC";
			self.getEventType(event) === 'houses' && (teamBody.houseId = rival.id);

			return self.createNewTeam(teamBody);
	}
}

function createPrototypeTeam(schoolId, event, rival, teamWrapper) {
	const self = this;

	const teamBody = {};
	teamBody.name			= teamWrapper.teamName.name;
	teamBody.ages			= event.ages;
	teamBody.gender			= TeamHelper.convertGenderToServerValue(event.gender);
	teamBody.sportId		= event.sportId;
	teamBody.schoolId		= schoolId;
	teamBody.players		= TeamHelper.convertPlayersToServerValue(teamWrapper.___teamManagerBinding.teamStudents);
	teamBody.teamType		= "PROTOTYPE";
	self.getEventType(event) === 'houses' && (teamBody.houseId = rival.id);

	return self.createNewTeam(teamBody);
}

function getTypeOfNewTeam(teamWrapper) {
	if(teamWrapper.selectedTeam) {
		return "CLONE";
	} else {
		return "ADHOC";
	}
}

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
}

function updateTeam(schoolId, teamId, body) {
	return window.Server.team.put({
		schoolId: schoolId,
		teamId: teamId
	}, body);
}

function createNewTeam(body) {
	return window.Server.teamsBySchoolId.post(body.schoolId, body);
}

function deleteTeamFromEvent(schoolId, eventId, teamId) {
	return window.Server.schoolEventTeam.delete({
		schoolId:	schoolId,
		eventId:	eventId,
		teamId:		teamId
	});
}

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
}

function addTeamsToEvent(schoolId, event, teams) {
	return Promise.all(teams.map(t => window.Server.schoolEventTeams.post(
		{
			schoolId:	schoolId,
			eventId:	event.id
		}, {
			teamId:		t.id
		}
	)));
}

/** Return client's event  type of event. Yes, there are client's and server's event type. Why? Who knows. */
function getEventType(event) {
	if(event.type) {
		return event.type;
	} else {
		return EventHelper.serverEventTypeToClientEventTypeMapping[event.eventType];
	}
}

/** Operation with result value according to provided type
 * @param {string} operation - operation type(['plus', 'minus'])
 * @param {Number} value - value to increment
 * @param {String} type - type of value: plain, seconds, hours, minutes, whatever
 * @param {Number} pointsStep - in case of plain/sec/cm - how much can be added in one step
 * @returns {Number} updated value
 */
function operationByType(operation, value, type, pointsStep){
	const	step = 	{
			plain:pointsStep,
			ms:pointsStep >= 1 ? 0.001 : pointsStep,
			sec:pointsStep < 1 ? 1: pointsStep,
			cm:pointsStep,
			km:100000,
			m:100,
			h:3600,
			min:60
		};

	let result;

	switch (operation){
		case OPERATION_TYPE.plus:
			result = value + step[type];
			break;
		case OPERATION_TYPE.minus:
			result = value - step[type];
			result = result < 0 ? value : result;
			break;
	}

	return result;
}
/** Increment result value according to provided type
 * @param {Number} value value to increment
 * @param {String} type type of value: plain, seconds, hours, minutes, whatever
 * @param {Number} pointsStep in case of plain/sec/cm - how much can be added in one step
 * @returns {Number} updated value
 */
function incByType(value, type, pointsStep) {
	return operationByType(OPERATION_TYPE.plus, value, type, pointsStep);
}

/** Decrement result value according to provided type
 * @param {Number} value value to increment
 * @param {String} type type of value: plain, seconds, hours, minutes, whatever
 * @param {Number} pointsStep in case of plain/sec/cm - how much can be removed in one step
 * @returns {Number} updated value, but always non-negative
 */
function decByType(value, type, pointsStep) {
	return operationByType(OPERATION_TYPE.minus, value, type, pointsStep);
}

/**
 * Calculate team points
 * @param {object} event
 * @param {string} teamId
 * @returns (number} - sum of individual points
 * */
function calculateTeamPoints(event, teamId){
	const team = event.teamsData.find(t => t.id === teamId),
		playerIds = team.players.map(p => {return p.userId}),
		scores = event.results.individualScore.map(s => {
			if(playerIds.indexOf(s.userId) !== -1)
				return s.score;
			else
				return 0;
		});

	return scores.reduce((a, b) => a + b*1, 0);
}

/**
 * Checking the results on the validation error.
 * @param {object} event
 * @returns {boolean} - false - not valid, true - valid
 * */
function checkValidationResultBeforeSubmit(event){
	const scoreNames = ['houseScore', 'individualScore', 'schoolScore', 'teamScore'];
	let result = true;

	scoreNames.find(scoreName => {
		const score = event.results[scoreName];

		if(score.length){
			let res = score.find(item => item.isValid === false);
			if(res){
				result = false;
				return true;
			}
		}
	});

	return result;
}

function clearIndividualScore(event, teamId) {
	const scores = event.results.individualScore.filter(s => s.teamId === teamId);

	scores.forEach(s => s.score = 0);
}
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
	isHousesEventForIndividualSport:		isHousesEventForIndividualSport,
	isInternalEventForOneOnOneSport:		isInternalEventForOneOnOneSport,
	isInternalEventForIndividualSport:		isInternalEventForIndividualSport,
	isInternalEventForTeamSport:			isInternalEventForTeamSport,
	isInterSchoolsEventForTeamSport:		isInterSchoolsEventForTeamSport,
	isInterSchoolsEventForIndividualSport:	isInterSchoolsEventForIndividualSport,
	isInterSchoolsEventForOneOnOneSport:	isInterSchoolsEventForOneOnOneSport,
	isTeamDataCorrect:						isTeamDataCorrect,
	isTeamSport:							isTeamSport,
	isShowEditEventButton:					isShowEditEventButton,
	isShowScoreEventButtonsBlock:					isShowScoreEventButtonsBlock,
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
	createNewTeam:							createNewTeam,
	createPrototypeTeam:					createPrototypeTeam,
	createTeam:								createTeam,
	deleteTeamFromEvent:					deleteTeamFromEvent,
	addTeamsToEvent:						addTeamsToEvent,
	addIndividualPlayersToEvent:			addIndividualPlayersToEvent,
	getEventType:							getEventType,
	getRivalForLeftContext:					getRivalForLeftContext,
	getRivalForRightContext:				getRivalForRightContext,
	convertPoints:							convertPoints,
	updateTeam:								updateTeam,
	operationByType:						operationByType,
	decByType:								decByType,
	incByType:								incByType,
	calculateTeamPoints: 					calculateTeamPoints,
	checkValidationResultBeforeSubmit: 		checkValidationResultBeforeSubmit,
	getParametersForLeftContext: 			getParametersForLeftContext,
	getParametersForRightContext: 			getParametersForRightContext,
	clearIndividualScore:					clearIndividualScore
};

module.exports = TeamHelper;