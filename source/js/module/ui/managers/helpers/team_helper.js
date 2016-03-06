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

function getHouseId(binding) {
    let id = undefined;

    if(binding.get('teamForm.isHouseSelected')) {
        id = binding.get('teamForm.rival.id');
    }

    return id;
};

/**
 * Get players.
 * player = student + player model.
 * That need for team manager element.
 * @param players - player model from server
 * @param team - team model from server
 * @returns {Array}
 * @private
 */
function getPlayers(players, team) {
    let result = [];

    team.players.forEach((student) => {
        let newPlayer = student;
        let findedPlayer = Lazy(players).findWhere({studentId: student.id});
        newPlayer.position = findedPlayer.position;
        newPlayer.sub = findedPlayer.sub;
        newPlayer.playerModelId = findedPlayer.id;

        result.push(newPlayer);
    });

    return result;
};



function commitPlayers(initialPlayers, players, teamId) {
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
                    teamId,
                    player
                )
            );
        });
    }

    return promises;
};

function _addPlayer(teamId, player) {
    return window.Server.playersRelation.put(
        {
            teamId: teamId,
            studentId: player.id
        },{
            position:  player.position,
            sub:       player.sub
        }
    );
};

function _deletePlayer(teamId, playerId) {
    return window.Server.playersRelation.delete({
        teamId: teamId,
        studentId: playerId
    });
};

function _changePlayer(teamId, playerId, changes) {
    return window.Server.exactlyPlayersByTeam.put(
        {
            teamId:    teamId,
            playerId:  playerId
        },
        {
            position:  changes.position,
            sub:       changes.sub
        }
    );
};

const TeamHelper = {
    getAges: getAges,
    validate: validate,
    getHouseId: getHouseId,
    getPlayers: getPlayers,
    commitPlayers: commitPlayers
};

module.exports = TeamHelper;