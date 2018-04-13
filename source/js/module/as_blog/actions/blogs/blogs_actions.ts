import * as BPromise from "bluebird";
import {OpenServiceList} from "module/core/service_list/open_service_list";
import {PostData} from "module/models/post/post";

export const BlogsActions = {
	getFeedPosts(): BPromise<PostData[]> {
		const openServiceList = new OpenServiceList();

		return openServiceList.blogsFeed.get();
	}
};