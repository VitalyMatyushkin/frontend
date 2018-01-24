export interface Sport {
	id: string
	name: string
	sportId?: string
	description?: string
	genders: {
		maleOnly: boolean,
		femaleOnly: boolean,
		mixed: boolean
	}
	field?: {
		pic?: string
		positions?: {
			_id: string
			name: string
			description?: string
			shape: FIELD_POSITION_SHAPES
			coords: number[]
		}[]
	}
	icon?: string
	scoring?: TYPE_OF_SCORING
	players: TYPE_OF_PLAYERS
	multiparty: boolean
	points?: {
		name: string
		namePlural: string
		pointsStep: number
		display: string
		inputMask?: string
	}
	discipline?: {
		_id: string
		name: string
		namePlural: string
		description?: string
	}[]
	performance?: {
		_id: string
		name: string
		minValue?: string
		maxValue?: string
	}[]
	defaultLimits?: {
		minPlayers: number
		maxPlayers: number
		minSubs: number
		maxSubs: number
	}
	individualResultsAvailable: boolean

	createdAt: string
	updatedAt: string
}

export enum FIELD_POSITION_SHAPES {
	CIRCLE = 'CIRCLE',
	RECT = 'RECT',
	POLY = 'POLY'
}

export enum TYPE_OF_SCORING {
	MORE_SCORES = 'MORE_SCORES',
	LESS_SCORES = 'LESS_SCORES',
	MORE_TIME = 'MORE_TIME',
	LESS_TIME = 'LESS_TIME',
	MORE_RESULT = 'MORE_RESULT',
	LESS_RESULT = 'LESS_RESULT',
	FIRST_TO_N_POINTS = 'FIRST_TO_N_POINTS'
}

export enum  TYPE_OF_PLAYERS {
	'1X1' = '1X1',			    // player vs player
	'2X2' = '2X2',			    // 2 players vs 2 players
	INDIVIDUAL = 'INDIVIDUAL',	// a lot of players involved, each one playing on its own. Like darts.
	TEAM = 'TEAM'			    // team vs team. Like football
};