export interface ClubFormData {
	description?: string
	duration: string
	maxParticipants: string | number
	name: string
	ownerId: string
	price?: string
	priceType?: string
	sportId: string
	venue: { placeId: string}
}