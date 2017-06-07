/**
 * Created by wert on 07.09.16.
 */

const SPORT_PLAYERS = {
	'1X1': 			'1X1',			// player vs player
	'2X2': 			'2X2',			// 2 players vs 2 players
	'INDIVIDUAL': 	'INDIVIDUAL',	// a lot of players involved, each one playing on its own. Like darts.
	'TEAM': 		'TEAM'			// team vs team. Like football
};

const SPORT_POINTS_TYPE = {
	'PLAIN':	'PLAIN',
	'TIME':		'TIME',
	'DISTANCE':	'DISTANCE'
};

const SPORT_ATHLETIC = {
	'PLAIN':		'Plain',
	'TIME': 		'Time',
	'DISTANCE':		'Distance',
	'EXTRA_SCORE': 	'Score'
};

const ALLOWED_GENDERS = {
	'MALE_ONLY':	'MALE_ONLY',
	'FEMALE_ONLY':	'FEMALE_ONLY',
	'MIXED': 		'MIXED'
};

module.exports.SPORT_PLAYERS = SPORT_PLAYERS;
module.exports.SPORT_POINTS_TYPE = SPORT_POINTS_TYPE;
module.exports.ALLOWED_GENDERS = ALLOWED_GENDERS;
module.exports.SPORT_ATHLETIC = SPORT_ATHLETIC;