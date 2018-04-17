import * as React from 'react';

import {PostData} from "module/models/post/post";
import {DateHelper} from "module/helpers/date_helper";

import 'styles/ui/blog/b_post_preview.scss'

export interface PostPreviewProps {
	post: PostData
}

export class PostPreview extends React.Component<PostPreviewProps, {}> {
	getPublishDate() {
		return DateHelper.getFormatDateTimeFromISOByRegion(
			this.props.post.publishedAt,
			'UK'
		);
	}
	redirectToPostPage() {
		document.location.hash = `blogs/${this.props.post.blogId}/posts/${this.props.post.id}`;
	}
    getAuthorFullName() {
		return `${this.props.post.author.firstName} ${this.props.post.author.lastName}`;
    }
	handleClickHeader() {
		this.redirectToPostPage();
	}
	render() {
		return (
			<div className='bPostPreview'>
				<h4
					className='ePostPreview_header'
				    onClick={() => this.handleClickHeader()}
				>
					{this.props.post.title}
				</h4>
				<div className='ePostPreview_content'>
					{this.props.post.content.substring(0, 350)}
				</div>
				<div className='ePostPreview_author'>
					<div className='ePostPreview_authorUserPickContainer'>
						<img
							className='ePostPreview_authorUserPick'
							src="https://pp.userapi.com/c824600/v824600525/858e4/feBmYQCSHHA.jpg"
							height="40px"
							width="40px"
						/>
					</div>
					<div className='ePostPreview_authorNameContainer'>
						<span className='ePostPreview_authorName'>{this.getAuthorFullName()}</span><br/>
						<span className='ePostPreview_postDate'>{this.getPublishDate()}</span>
					</div>
				</div>
			</div>
		);
	}
}