type TYPE_OF_PLAYERS 			= '1X1' | '2X2'| 'INDIVIDUAL' | 'TEAM';
type FIELD_POSITION_SHAPES 		= 'CIRCLE' | 'RECT' | 'POLY';
type TYPE_OF_SCORING 			= 'MORE_SCORES' | 'LESS_SCORES' | 'MORE_TIME' | 'LESS_TIME' | 'MORE_RESULT' | 'LESS_RESULT' | 'FIRST_TO_N_POINTS';
type POINTS_DISPLAY 			= 'PLAIN' | 'TIME' | 'DISTANCE' | 'PRESENCE_ONLY';

interface SportGenders {
	maleOnly: 	boolean,
	femaleOnly: boolean,
	mixed: 		boolean
}

interface SportLimits {
	minPlayers?: 	number,
	maxPlayers?: 	number,
	minSubs?: 		number,
	maxSubs?: 		number
}

interface SportField {
	pic?:		string,
	positions: 	SportPosition[]
}

interface SportPosition{
	name:			string,
	description?:	string,
	shape?:			FIELD_POSITION_SHAPES,
	coords:			number[]
}

interface SportPoint {
	name: 			string,
	namePlural: 	string,
	pointsStep: 	number,
	display: 		POINTS_DISPLAY,
	inputMask?: 	string
}

interface SportDiscipline {
	name: 			string,
	namePlural:		string,
	description:	string
}

interface SportPerformance {
	name:		string,
	minValue?:	number,
	maxValue?:	number
}

export interface Sport {
	id: 						string,
	createdAt: 					string,
	defaultLimits?: 			SportLimits,
	description?: 				string,
	discipline?: 				SportDiscipline[],
	field?: 					SportField,
	genders: 					SportGenders,
	individualResultsAvailable: boolean,
	isFavorite: 				boolean,
	multiparty: 				boolean,
	name: 						string,
	performance?: 				SportPerformance[],
	players: 					TYPE_OF_PLAYERS,
	points: 					SportPoint,
	scoring: 					TYPE_OF_SCORING,
	updatedAt: 					string
}