const   TeamPlayersValidator = require('module/ui/managers/helpers/team_players_validator'),
		Lazy                 = require('lazy.js'),
		Immutable            = require('immutable');

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
	const limits = {
		maxPlayers: binding.get('teamForm.default.model.sportModel.limits.maxPlayers'),
		minPlayers: binding.get('teamForm.default.model.sportModel.limits.minPlayers'),
		maxSubs:    binding.get('teamForm.default.model.sportModel.limits.maxSubs')
	};

	const result = TeamPlayersValidator.validate(
		binding.toJS('teamForm.players'),
		limits
	);

	binding.set('teamForm.error',
		Immutable.fromJS(result)
	);
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

function commitPlayers(initialPlayers, players, teamId, schoolId) {
	let promises = [];

	initialPlayers.forEach((initialPlayer) => {
		let findedPlayer = Lazy(players).findWhere({id:initialPlayer.id});

		if(findedPlayer) {
			//Mmm, check for modifications
			let changes = {};
			if(findedPlayer.position !== initialPlayer.position) {
				changes.position = findedPlayer.position;
			}
			if(findedPlayer.sub !== initialPlayer.sub) {
				changes.sub = findedPlayer.sub;
			}
			if(changes.position !== undefined || changes.sub !== undefined) {
				promises.push(
					changePlayer(
						schoolId,
						teamId,
						initialPlayer.id,
						changes
					)
				);
			}
			players.splice(
				Lazy(players).indexOf(findedPlayer),
				1
			);
		} else {
			//So, user delete player, let's delete player from server
			promises.push(
				deletePlayer(
					schoolId,
					teamId,
					initialPlayer.id
				)
			);
		}
	});
	if(players.length > 0) {
		//Hmmm...new players!
		players.forEach((player) => {
			promises.push(
				addPlayer(
					schoolId,
					teamId,
					player
				)
			);
		});
	}

	return promises;
};

function addPlayer(schoolId, teamId, body) {
	return window.Server.teamPlayers.post(
		{
			schoolId:  schoolId,
			teamId:     teamId
		},
		body
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

const TeamHelper = {
	getAges:					getAges,
	validate:					validate,
	getSportById:				getSportById,
	getPlayersWithUserInfo:		getPlayersWithUserInfo,
	addPlayer:					addPlayer,
	changePlayer:				changePlayer,
	deletePlayer:				deletePlayer,
	commitPlayers:				commitPlayers,
	injectFormsToPlayers:		injectFormsToPlayers,
	injectTeamIdToPlayers:		injectTeamIdToPlayers,
	convertPointsToClientModel:	convertPointsToClientModel
};

module.exports = TeamHelper;