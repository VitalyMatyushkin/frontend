import * as React from 'react';
import * as Morearty from 'morearty';

import * as Route from 'module/core/route';
import * as RouterView from 'module/core/router';

import {PostWrapper} from "module/as_blog/componnets/post_wrapper/post_wrapper";
import {BlogsWrapper} from 'module/as_blog/componnets/blogs_wrapper/blogs_wrapper'

import 'styles/ui/blog/b_blog.scss'

export const Application = (React as any).createClass({
	mixins: [Morearty.Mixin],
	getMergeStrategy() {
		return Morearty.MergeStrategy.MERGE_REPLACE;
	},
	render() {
		const binding = this.getDefaultBinding();

		return (
			<div className='bMainLayout mClearFix'>
				<div className="bBlogContainer">
					<RouterView
						routes={binding.sub('routing')}
						binding={binding}
					>
						<Route
							path="/feed"
					        binding={binding.sub('blogComponent')}
						    component={BlogsWrapper}
						/>
						<Route
							path="/blogs/:blogId/posts/:postId"
							binding={binding.sub('postComponent')}
							component={PostWrapper}
						/>
					</RouterView>
				</div>
			</div>
		)
	}
});