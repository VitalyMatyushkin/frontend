import * as React from 'react';
import * as Reactmarkdown from 'react-markdown';
import InstagramEmbed from 'react-instagram-embed'
import {TwitterTweetEmbed} from 'react-twitter-embed';
import YouTube from 'react-youtube';
import {PostData} from "module/models/post/post";
import 'styles/ui/blog/b_post.scss'

export interface PostProps {
	post: PostData
}

const TWEET_ID_REGEXP = /twitter.com\/[a-zA-Z0-9_]*\/status\/([0-9]+)/g;
const YOUTUBE_VIDEO_ID_REGEXP = /youtu.be\/([a-zA-Z0-9]+)/g;

export class Post extends React.Component<PostProps, {}> {
	redirectToFeedPage() {
		document.location.hash = `feed`;
	}
	handleClickHeader() {
		this.redirectToFeedPage();
	}
	getInstagramUrlArray(): string[] {
		let instagramUrlArray = [];

		const result = this.props.post.content.match(/(https|http):\/\/www.instagram.com\/p\/[a-zA-Z0-9_]+\//g);
		if(result != null) {
			instagramUrlArray = result;
		}

		return instagramUrlArray;
	}
	getTweetIdArray(): string[] {
		let twitterUrlArray = [];

		let result = null;
		do {
			result = TWEET_ID_REGEXP.exec(this.props.post.content);
			if (result) {
				twitterUrlArray.push(result[1]);
			}
		} while (result != null);

		return twitterUrlArray;
	}
	getYoutubeIdArray(): string[] {
		let youtubeIdArray = [];

		let result = null;
		do {
			result = YOUTUBE_VIDEO_ID_REGEXP.exec(this.props.post.content);
			if (result) {
				youtubeIdArray.push(result[1]);
			}
		} while (result != null);

		return youtubeIdArray;
	}
	renderInstagramEmbeded() {
		return (
			<div className='row'>
				<h2 className='ePost_attachmentsHeader'>Instagram attachments</h2>
				{
					this.getInstagramUrlArray().map(url => {
						return (
							<div className='col-md-6 col-sm-6 col-xs-6'>
								<InstagramEmbed
									url={url}
									maxWidth={320}
									hideCaption={false}
									containerTagName='div'
									protocol=''
									onLoading={() => {}}
									onSuccess={() => {}}
									onAfterRender={() => {}}
									onFailure={() => {}}
								/>
							</div>
						);
					})
				}
			</div>
		);
	}
	renderTwitterEmbeded() {
		return (
			<div className='row'>
				<h2 className='ePost_attachmentsHeader'>Twitter attachments</h2>
				{
					this.getTweetIdArray().map(tweetId => {
						return (
							<div className='col-md-6 col-sm-6 col-xs-6'>
								<TwitterTweetEmbed
									tweetId={tweetId}
								/>
							</div>
						);
					})
				}
			</div>
		);
	}
	renderYouTubeEmbeded() {
		return (
			<div className='row'>
				<h2 className='ePost_attachmentsHeader'>YouTube attachments</h2>
				{
					this.getYoutubeIdArray().map(videoId => {
						return (
							<div className='col-md-12 col-sm-12 col-xs-12'>
								<YouTube
									videoId={videoId}
								/>
							</div>
						);
					})
				}
			</div>
		);
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
						<div className='ePost_content'>
							<div className='ePost_contentMain'>
								<Reactmarkdown
									source={this.props.post.content}
								/>
							</div>
							{this.renderInstagramEmbeded()}
							{this.renderTwitterEmbeded()}
							{this.renderYouTubeEmbeded()}
						</div>
					</div>
				</div>
			</div>
		);
	}
}