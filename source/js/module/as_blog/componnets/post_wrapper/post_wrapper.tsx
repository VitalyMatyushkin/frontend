import * as	React from 'react';
import * as	Immutable from 'immutable';
import * as	Morearty from 'morearty';

import {Post} from "module/as_blog/componnets/post/post";

import {PostsActions} from "module/as_blog/actions/posts/posts_actions";

export const PostWrapper  = (React as any).createClass({
	mixins: [Morearty.Mixin],
	getDefaultState() {
		return Immutable.fromJS({
			isSync: false,
			postData: undefined
		});
	},
	componentWillMount() {
		PostsActions.getPost(this.getBlogIdFromUrl(), this.getPostIdFromUrl())
			.then(postData => {
				this.getDefaultBinding().set('isSync', true);
				this.getDefaultBinding().set('postData', Immutable.fromJS(postData));
			});
	},
	getBlogIdFromUrl(): string {
		return this.getMoreartyContext().getBinding().sub('routing.pathParameters').toJS()[0];
	},
	getPostIdFromUrl(): string {
		return this.getMoreartyContext().getBinding().sub('routing.pathParameters').toJS()[1];
	},
	render() {
		if(this.getDefaultBinding().toJS('isSync')) {
			return (
				<Post post={this.getDefaultBinding().toJS('postData')}/>
			);
		} else {
			return null;
		}
	}
});