function validate(players, limits) {
    let isError = false,
        text = undefined;

    if(players && (players.length === 0 || players.length < limits.minPlayers)) {
        isError = true;
        text = `Number of players should be great or equal ${limits.minPlayers}`;
    } else if(players && players.length > limits.maxPlayers) {
        isError = true;
        text = `Number of players should be less or equal ${limits.maxPlayers}`;
    } else if(players && !isPositionsCorrect(players)) {
        isError = true;
        text = 'All players should have position';
    } else if(players && !isSubstitutionCountCorrect(players, limits.maxSubs)) {
        isError = true;
        text = `Number of sub players should be less or equal ${limits.maxSubs}`;
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