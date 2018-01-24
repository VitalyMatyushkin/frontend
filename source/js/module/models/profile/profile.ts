export interface Profile {
	id: string

	firstName?: string
	lastName?: string

	avatar?: string
	birthday?: string
	email?: string
	gender?: GENDERS
	status?: STATUS
	phone?: string

	notification?: {
		sendPromoOffers?: boolean
		sendInfoUpdates?: boolean
		sendNews?: boolean
	}

	verification?: {
		status?: {
			email?: boolean
			personal?: boolean
			sms?: boolean
		}
	}

	webIntroEnabled: boolean
	webIntroShowTimes: number

	createdAt: string
	updatedAt: string
}

export enum GENDERS {
	MALE = 'MALE',
	FEMALE = 'FEMALE'
}

export enum STATUS {
	ACTIVE = 'ACTIVE',
	BLOCKED = 'BLOCKED',
	REMOVED = 'REMOVED'
}