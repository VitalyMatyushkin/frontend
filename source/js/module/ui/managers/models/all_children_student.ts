import {DefaultStudent, House} from "module/ui/managers/models/default_student";

export interface AllChildrenStudent extends DefaultStudent{
	house: House
	parents: string[]
	messageStatus: string
}