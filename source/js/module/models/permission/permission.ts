export interface Permission {
	id: string
	activatedAt: string
	createdAt: string
	details: object
	preset: string
	role: string
	school: object
	schoolId: string
	schoolIds: string[]
	sportIds: string[],
	sports: any[],
	status: string
	comment?: string
} 