import {DefaultStudent, House} from "module/ui/managers/models/default_student";

export interface BookedChildrenStudent extends DefaultStudent{
	house: House
	parents: string[]
	messageStatus: string
}
