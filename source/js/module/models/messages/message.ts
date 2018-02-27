import {ALLOWED_GENDERS, STAFF_ROLES} from "module/models/club/club";

export interface Message {
	id: string

	eventId?: string
	eventData?: {
		id: string
		sport?: {
			name: string
		}
		ages: any[]
		gender: string
		startTime: string
		venue: {
			venueType: string
			postcodeId?: string
			postcode?: string
			postcodeData?: {
				id: string
				postcode: string
				postcodeNoSpaces: string
				point?: {
					type: string
					coordinates: number[]
					lng?: number
					lat?: number
				}
			}
		}
	}

	schoolId: string
	schoolData: {
		id: string
		name: string
		pic?: string
	}

	sender?: {
		userId: string
		permissionId: string
		schoolId?: string
		fullName?: string
	}
	receiverList?: {
		userId: string
		permissionId: string
	}[]

	playerDetails?: {
		userId?: string
		permissionId?: string
	}
	playerDetailsData?: {
		id: string
		firstName: string
		lastName: string
		gender: string
		parents: string[]
	}

	title?: string
	text?: string
	isActionPerformed?: boolean
	isActionPerformedSetAt?: Date
	threadId: string

	fields?: {
		heading?: string
		type?: string
		isRequired?: boolean
		enumOptions?: string[]
		value?: any
	}[]

	clubId?: string
	clubData: {
		name?: string
		gender?: ALLOWED_GENDERS
		ages?: number[]
		staff?: {
			_id: string
			userId: string
			permissionId: string
			staffRole?: STAFF_ROLES
		}[]
		startDate?: Date
		finishDate?: Date
		days?: string[]
		time?: Date
		duration?: number
		description?: string
	}

	// Event Invitation Message
	invitationStatus?: string
	invitationStatusSetAt?:	string,

	// Event Participation Message
	details?: string
	isTakePart?: boolean

	kind?: string

	updatedAt: string
	createdAt: string
}