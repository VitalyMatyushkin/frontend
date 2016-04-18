const   TeamPlayersValidator = require('module/ui/managers/helpers/team_players_validator'),
        Lazy                 = require('lazyjs'),
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

        const updUser = Object.assign({}, foundUser);

        updUser.position        = player.position;
        updUser.sub             = player.sub;
        updUser.playerModelId   = player._id;

        return updUser;
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
                    _changePlayer(
                        schoolId,
                        teamId,
                        initialPlayer.playerModelId,
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
                _deletePlayer(
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
                _addPlayer(
                    schoolId,
                    teamId,
                    player
                )
            );
        });
    }

    return promises;
};

function _addPlayer(schoolId, teamId, body) {
    return window.Server.teamPlayers.post(
        {
            schoolId:  schoolId,
            teamId:     teamId
        },
        body
    );
};

function _deletePlayer(schoolId, teamId, playerId) {
    return window.Server.teamPlayer.delete({
        schoolId:   schoolId,
        teamId:     teamId,
        playerId:   playerId
    });
};

function _changePlayer(schoolId, teamId, playerId, changes) {
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
 * Search sport by sportId in sport array and return it.
 * @param sportId - current sport id
 * @param sports - sports array
 * @returns found sport
 */
function getSportById(sportId, sports) {
    return Lazy(sports).findWhere({id: sportId});
};

const TeamHelper = {
    getAges:                getAges,
    validate:               validate,
    getSportById:           getSportById,
    getPlayersWithUserInfo: getPlayersWithUserInfo,
    commitPlayers:          commitPlayers,
    injectFormsToPlayers:   injectFormsToPlayers
};

module.exports = TeamHelper;