export interface PostData {
	id: string
	authorId: string
	blogId: string
	status: PostStatus
	title: string
	content: string
	updatedAt: string
	createdAt: string
	publishedAt: string
	threadId: string
}

export enum PostStatus {
	DRAFT = 'DRAFT',
	PUBLISHED = 'PUBLISHED',
	REMOVED = 'REMOVED'
}