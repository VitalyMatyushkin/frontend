function validate(players, limits) {
    let isError = false,
        text = undefined;

    if(players && (players.length === 0 || players.length < limits.minPlayers)) {
        isError = true;
        text = `Player count should be greater than ${limits.minPlayers} or equal`;
    } else if(players && players.length > limits.maxPlayers) {
        isError = true;
        text = `Player count should be less than ${limits.maxPlayers} or equal`;
    } else if(players && !isPositionsCorrect(players)) {
        isError = true;
        text = 'All players should have position';
    } else if(players && !isSubstitutionCountCorrect(players, limits.maxSubs)) {
        isError = true;
        text = `Substitution count should be less than ${limits.maxSubs} or equal`;
    }

    return {
        isError:   isError,
        text:      text
    };
};

function isPositionsCorrect(players) {
    let isCorrect = true;

    for(let i = 0; i < players.length; i++) {
        if(players[i].position === undefined) {
            isCorrect = false;
            break;
        }
    }

    return isCorrect;
};

function isSubstitutionCountCorrect(players, maxSubs) {
    let subCount = 0;

    for(let i = 0; i < players.length; i++) {
        if(players[i].sub !== undefined && players[i].sub) {
            subCount++;
        }
    }

    return !(subCount > maxSubs);
};


const TeamPlayersValidator = {
    validate: validate
};

module.exports = TeamPlayersValidator;