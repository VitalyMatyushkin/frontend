import * as BPromise from "bluebird";
import {OpenServiceList} from "module/core/service_list/open_service_list";
import {PostData} from "module/models/post/post";

const openServiceList = new OpenServiceList();

export const PostsActions = {
	getPostsByBlogId(blogId: string): BPromise<PostData[]> {
		return openServiceList.blogPosts.get({blogId});
	},
	getPost(blogId: string, postId: string): BPromise<PostData> {
		return openServiceList.blogPost.get({blogId, postId});
	}
};