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
		const cricketNames = ['cricket', 'cricket t20', 'cricket sixes', 'kwick cricket'];

		return cricketNames.some(cricketName => cricketName === sportName.toLowerCase());
	},
	
	/**
	 * Function return true, if sport is athletic (with different names)
	 * @param sportName {string}
	 * @returns {boolean}
	 */
	isAthletics: function(sportName){
		const athleticNames = ['sprint (100 m)'];
		
		return athleticNames.some(athleticName => athleticName === sportName.toLowerCase());
	}
};

module.exports = SportHelper;