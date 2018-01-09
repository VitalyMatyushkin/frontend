import {Permission} from "module/models/permission/permission";

export interface Role {
	name: string
	permissions: Permission[]
}