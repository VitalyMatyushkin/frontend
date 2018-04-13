import * as React from 'react';
import {PostPreview} from "module/as_blog/componnets/post_preview/post_preview";

import {BlogData} from "module/models/blog/blog";
import 'styles/ui/blog/b_blog.scss'

export interface BlogProps {
	blog: BlogData
}

export class Blog extends React.Component<BlogProps, {}> {
	renderPosts() {
		return this.props.blog.posts.map(post => <PostPreview post={post}/>);
	}
	render() {
		return (
			<div className='bBlog'>
				{this.renderPosts()}
			</div>
		);
	}
}