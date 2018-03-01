import {ExtraItem} from "module/ui/checkbox_list/models/extra_item";

export interface Item {
	id: string
	text: string
	additionalData?: any
	extraItems: ExtraItem[]
	checked: boolean
}