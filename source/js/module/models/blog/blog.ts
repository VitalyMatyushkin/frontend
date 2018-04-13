import {PostData} from "module/models/post/post";

export interface BlogData {
	id: string
	authorId: string
	name: string
	status: BlogStatus
	posts: PostData[]
	updatedAt: string
	createdAt: string
}

export enum BlogStatus {
	DRAFT = 'DRAFT',
	PUBLISHED = 'PUBLISHED',
	REMOVED = 'REMOVED'
}