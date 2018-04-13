import * as React from 'react';
import {Blog} from "module/as_blog/componnets/blog/blog";
import {BlogData} from "module/models/blog/blog";

import 'styles/ui/blog/b_blogs.scss'

export interface BlogsProps {
	blogs: BlogData[]
}

export class Blogs extends React.Component<BlogsProps, {}> {
	renderBlogs() {
		return this.props.blogs.map(blog => <Blog blog={blog}/>);
	}
	render() {
		return (
			<div className='bBlogs'>
				{this.renderBlogs()}
			</div>
		);
	}
}