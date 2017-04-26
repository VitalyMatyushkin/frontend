/**
 * Created by Woland on 26.04.2017.
 */
const SportHelper = {
	/**
	 * Function return true, if sport is cricket (with different names)
	 * @param sportName {string}
	 * @returns {boolean}
	 */
	isCricket: function(sportName){
		const cricketNames = ['cricket', 'cricket t20', 'cricket sixes'];

		return cricketNames.some(cricketName => cricketName === sportName.toLowerCase());
	}
};

module.exports = SportHelper;