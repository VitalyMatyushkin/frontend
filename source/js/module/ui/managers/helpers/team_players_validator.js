const TeamPlayersValidator = {
    validate: function(players, limits, subscriptionPlan) {
		console.log(subscriptionPlan);
        const self = this;

        let isError = false,
            text = undefined;

        if(subscriptionPlan !== "LITE" && typeof players !== 'undefined') {
			if (players && limits.minPlayers && players.length < limits.minPlayers) {
				isError = true;
				text = `Number of players should be greater or equal ${limits.minPlayers}`;
			} else if (players && limits.maxPlayers && players.length > limits.maxPlayers) {
				isError = true;
				text = `Number of players should be less or equal ${limits.maxPlayers}`;
			} else if (players) {
				const errorObject = self.checkSubstitutions(players, limits.minSubs, limits.maxSubs);
				isError = errorObject.isError;
				text = errorObject.text;
			}
		}

        return {
            isError:   isError,
            text:      text
        };
    },
    checkSubstitutions: function(players, minSubs, maxSubs) {
        const result = {
            isError:    false,
            text:       undefined
        };

        const subsCount = players.filter(p => p.sub).length;

        if(minSubs && subsCount < minSubs) {
            result.isError = true;
            result.text = `Number of sub players should be great or equal ${minSubs}`;
        } else if(maxSubs && subsCount > maxSubs) {
            result.isError = true;
            result.text = `Number of sub players should be less or equal ${maxSubs}`;
        }

        return result;
    }
};

module.exports = TeamPlayersValidator;