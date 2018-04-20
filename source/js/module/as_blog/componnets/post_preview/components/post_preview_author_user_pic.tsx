import * as React from 'react';
import {PostData} from "module/models/post/post";
import 'styles/ui/blog/b_post_preview.scss'
import {SVG} from "module/ui/svg";

export interface PostPreviewAuthorUserPicProps {
	post: PostData
}

export class PostPreviewAuthorUserPic extends React.Component<PostPreviewAuthorUserPicProps, {}> {
	render() {
		return (
			<div className='ePostPreview_authorUserPickContainer'>
				{
					typeof this.props.post.author.avatar !== 'undefined' ?
						<img
							className='ePostPreview_authorUserPick'
							src={this.props.post.author.avatar}
							height="40px"
							width="40px"
						/> :
						<SVG icon="icon_avatar_plug"/>

				}

			</div>
		);
	}
}