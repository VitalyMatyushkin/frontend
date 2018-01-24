export interface Club {
	id: string
	name?: string
	description?: string
	schoolId: string
	school: {
		id: string
		name: string
	}
	sportId: string
	sport: {
		id: string
		name: string
	}
	ages?: number[]
	gender?: ALLOWED_GENDERS
	price?: {
		priceType?: PRICING
		price?: number
		currency?: CURRENCY
	}
	maxParticipants?: number
	participants?: {
		_id: string
		userId: string
		permissionId: string
	}[]
	// schedule
	status?: STATUS
	staff?: {
		_id: string
		userId: string
		permissionId: string
		staffRole?: STAFF_ROLES
	}[]
	venue?: {
		placeId?: string
	}

	createdAt: string
	updatedAt: string
}

export enum ALLOWED_GENDERS {
	MALE_ONLY = 'MALE_ONLY',
	FEMALE_ONLY = 'FEMALE_ONLY',
	MIXED = 'MIXED'
}

export enum PRICING {
	FREE = 'FREE',
	PER_SESSION = 'PER_SESSION',
	HALF_TERM = 'HALF_TERM',
	TERM = 'TERM'
}

export enum CURRENCY {
	POUND = 'POUND'
}

export enum STATUS {
	DRAFT = 'DRAFT',
	ACTIVE = 'ACTIVE',
	REMOVED = 'REMOVED',
	ARCHIVED = 'ARCHIVED'
}

export enum STAFF_ROLES {
	COACH = 'COACH',
	MEMBER_OF_STAFF = 'MEMBER_OF_STAFF'
}