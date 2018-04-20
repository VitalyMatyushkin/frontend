import * as React from 'react';
import * as Reactmarkdown from 'react-markdown';

import {PostData} from "module/models/post/post";
import {DateHelper} from "module/helpers/date_helper";

import 'styles/ui/blog/b_post_preview.scss'
import {PostPreviewAuthorUserPic} from "module/as_blog/componnets/post_preview/components/post_preview_author_user_pic";

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
					<Reactmarkdown
						source={this.props.post.content.substring(0, 350)}
					/>
				</div>
				<div className='ePostPreview_author'>
					<PostPreviewAuthorUserPic post={this.props.post}/>
					<div className='ePostPreview_authorNameContainer'>
						<span className='ePostPreview_authorName'>{this.getAuthorFullName()}</span><br/>
						<span className='ePostPreview_postDate'>{this.getPublishDate()}</span>
					</div>
				</div>
			</div>
		);
	}
}