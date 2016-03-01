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

const TeamHelper = {
    getAges: getAges,
    validate: validate,
    getHouseId: getHouseId,
    getPlayers: getPlayers
};

module.exports = TeamHelper;