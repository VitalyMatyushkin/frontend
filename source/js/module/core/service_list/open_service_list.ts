import {Service} from 'module/core/service';
import * as ImageService from 'module/core/services/ImageService';
import {BlogData} from "module/models/blog/blog";
import {PostData} from "module/models/post/post";

/** Collection of services to reach REST API from server */
export class OpenServiceList {
	blog: Service<BlogData, BlogData, any>;
	blogs: Service<BlogData[], BlogData, any>;
	blogsFeed: Service<PostData[], PostData, any>;
	blogPost: Service<PostData, PostData, any>;
	blogPosts: Service<PostData[], PostData, any>;
	publicSchool: Service;
	publicSchools: Service;
	images: any;

	// Services which require authorization
	constructor() {
		// Instead of find one we find all because we don't know school
		// id when user click or type in school domain url
		// so we query all schools
		this.publicSchool = new Service('/public/schools/{schoolId}', undefined);
		this.publicSchools = new Service('/public/schools', undefined);

		// Blogs
		this.blogsFeed = new Service<PostData[], PostData, any>('/public/blogs/feed', undefined);

		this.blog = new Service<BlogData, BlogData, any>('/public/blogs/{blogId}', undefined);
		this.blogs = new Service<BlogData[], BlogData, any>('/public/blogs', undefined);

		this.blogPost = new Service<PostData, PostData, any>('/public/blogs/{blogId}/posts/{postId}', undefined);
		this.blogPosts = new Service<PostData[], PostData, any>('/public/blogs/{blogId}/posts', undefined);

		/* I don't like idea of using window.apiImg here, but it was easiest solution withoug global refactoring */
		this.images = new ImageService((window as any).apiImg);
	}
};