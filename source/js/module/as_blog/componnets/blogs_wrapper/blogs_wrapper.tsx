import * as	React from 'react';
import * as	Morearty from 'morearty';
import * as	Immutable from 'immutable';

import {BlogsActions} from "module/as_blog/actions/blogs/blogs_actions";
import {Feed} from "module/as_blog/componnets/feed/feed";

export const BlogsWrapper = (React as any).createClass({
	mixins: [Morearty.Mixin],
	getDefaultState() {
		return Immutable.fromJS({
			posts: []
		});
	},
	componentWillMount() {
		BlogsActions.getFeedPosts().then(posts => {
			this.getDefaultBinding().set('posts', Immutable.fromJS(posts));
		});
	},
	getPosts() {
		return this.getDefaultBinding().toJS('posts');
	},
	render: function () {
		return (
			<Feed posts={this.getPosts()}/>
		);
	}
});