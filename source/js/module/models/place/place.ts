export interface Place {
	id: string
	name?: string
	schoolId: string
	postcodeId: string
	postcode: string
	postcodeNoSpaces: string
	point?: {
		type: string
		coordinates: number[]
	}
}