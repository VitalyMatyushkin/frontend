export interface ClubFormData {
	description: string | undefined
	duration: string
	maxParticipants: string
	name: string
	ownerId: string
	price: string | undefined
	priceType: string | undefined
	sportId: string
	venue: { placeId: string}
}