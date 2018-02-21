import {DefaultStudent, House} from "module/ui/managers/models/default_student";

export interface BookedChildrenStudent extends DefaultStudent{
	house: House
	parents: {
		firstName: string
		lastName: string
		permissionId: string
		userId: string
	}[]
	messageStatus: string
}
