import * as React from 'react';

import {PostData} from "module/models/post/post";

import 'styles/ui/blog/b_post.scss'

export interface PostProps {
	post: PostData
}

export class Post extends React.Component<PostProps, {}> {
	redirectToFeedPage() {
		document.location.hash = `feed`;
	}
	handleClickHeader() {
		this.redirectToFeedPage();
	}
	render() {
		return (
			<div className='bPost container'>
				<div className='row'>
					<div className='col-md-8 col-md-offset-2 col-xs-12'>
						<div className='ePost_mainHeader' onClick={() => this.handleClickHeader()}>
							Squad in touch blogs
						</div>
						<h1 className='ePost_header'>
							{this.props.post.title}
						</h1>
						<p className='ePost_content'>
							{this.props.post.content}
						</p>
					</div>
				</div>
			</div>
		);
	}
}