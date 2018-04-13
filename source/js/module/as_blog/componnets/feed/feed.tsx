import * as React from 'react';

import {PostData} from "module/models/post/post";
import {PostPreview} from "module/as_blog/componnets/post_preview/post_preview";

import 'styles/ui/blog/b_feed.scss'

export interface FeedProps {
	posts: PostData[]
}

export class Feed extends React.Component<FeedProps, {}> {
	renderPosts() {
		return this.props.posts.map(post => {
			return (
				<div className='col-lg-4 col-md-6 col-sm-12 col-xs-12'>
					<PostPreview post={post}/>
				</div>
			);
		});
	}
	render() {
		return (
			<div className='bFeed container'>
				<div className='row'>
					<div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>

					</div>
				</div>
				<div className='row'>
					<div className='col-lg-12 col-md-12 col-sm-12 col-xs-12'>
						<div className='eFeed_header'>
							Squad in touch blogs
						</div>
						<div className='eFeed_section'>
							<div className='eFeed_sectionTitle'>
								<div className='eFeed_sectionTitleText'>
									Featured
								</div>
							</div>
							<div className='eFeed_sectionBody row'>
								{this.renderPosts()}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}