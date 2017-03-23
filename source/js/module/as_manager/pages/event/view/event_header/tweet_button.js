/**
 * Created by Woland on 21.03.2017.
 */
const	React 				= require('react'),
		Button				= require('module/ui/button/button'),
		If					= require('module/ui/if/if'),
		ConfirmPopup 		= require('module/ui/confirm_popup'),
		classNames 			= require('classnames');

const 	TWEET_LENGTH 		= 140,
		TWEET_LINK_LENGTH 	= 30; //usually it value get from twitter api, but we go to easy way

const TweetButton = React.createClass({
	propTypes: {
		isTweetButtonRender: 	React.PropTypes.bool.isRequired,
		twitterData: 			React.PropTypes.array.isRequired,
		textForTweet: 			React.PropTypes.string.isRequired,
		linkForTweet: 			React.PropTypes.string.isRequired,
		activeSchoolId: 		React.PropTypes.string.isRequired,
		twitterIdDefault: 		React.PropTypes.string.isRequired
	},
	
	getInitialState: function(){
		return {
			isPopupOpen: 	false,
			textForTweet: 	this.props.textForTweet + ' ' + this.props.linkForTweet,
			twitterId: 		this.props.twitterIdDefault
		}
	},

	//If a user has more than one twitter account, we give him the choice of which account to make a tweet
	renderTwitterAccountChooser: function(){
		
		return this.props.twitterData.map( twitterItem => {
			return(
				<option
					key			= { twitterItem.id }
					value 		= { twitterItem.id }
				>
					{ twitterItem.name }
				</option>
			);
		});
	},
	
	onTwitterButtonClick: function(){
		this.setState({
			isPopupOpen: true
		});
	},
	
	onPopupOkClick: function(){
		const data = {
			text: this.state.textForTweet
		};
		
		window.Server.integrationTwitterTweet.post({
			schoolId:	this.props.activeSchoolId,
			twitterId:	this.state.twitterId
		}, data).then( () => {
			this.setState({
				isPopupOpen: false
			});
			window.simpleAlert(
				'Success published!',
				'Ok',
				() => {}
			);
		});
	},
	
	onPopupCancelClick: function(){
		this.setState({
			isPopupOpen: false
		});
	},
	
	onPopupTextareaChange: function(event : any){
		this.setState({
			textForTweet: event.target.value
		});
	},
	
	onSelectChange: function(event : any){
		this.setState({
			twitterId: event.target.value
		});
	},
	
	/**
	 * Function return count links from text for tweet
	 * @param {string} - text for tweet
	 * @returns {number} - count links
	 */
	getNumberLinksInTweet: function(textForTweet){
		const count = textForTweet !== '' ? textForTweet.match(/https?:\/\//g) : [];
		
		return typeof count !== 'undefined' && count !== null ? count.length : 0;
	},
	/**
	 * Function return length of tweet without links
	 * @param {string} - text for tweet
	 * @param {number} - count links
	 * @return {number} - length of tweet without links
	 */
	getTextWithoutLinkLength: function(textForTweet, numberLinksInTweet){
		
		for (let i = 0; i < numberLinksInTweet; i++) {
			let startPos, endPos, startStr, endStr;
			if (i === numberLinksInTweet - 1) {
				startPos = textForTweet.match(/https?:\/\//).index;
				endPos = textForTweet.indexOf(' ', startPos);
				if (endPos === -1) {
					textForTweet = textForTweet.substring(0, startPos);
				} else {
					startStr = textForTweet.substring(0, startPos - 1);
					endStr = textForTweet.substring(endPos + 1);
					textForTweet = startStr + endStr;
				}
			} else {
				startPos = textForTweet.match(/https?:\/\//).index;
				endPos = textForTweet.indexOf(' ', startPos);
				startStr = textForTweet.substring(0, startPos - 1);
				endStr = textForTweet.substring(endPos + 1);
				textForTweet = startStr + endStr;
			}
		}
		
		return textForTweet.length;
	},
	
	render: function(){
		const 	textForTweet 		= this.state.textForTweet,
				numberLinksInTweet 	= this.getNumberLinksInTweet(textForTweet),
				textForTweetLength 	= numberLinksInTweet > 0 ? this.getTextWithoutLinkLength(textForTweet, numberLinksInTweet) + (TWEET_LINK_LENGTH * numberLinksInTweet) : textForTweet.length;

		const stylesTweetLength = classNames({
			mInvalid: 		textForTweetLength > TWEET_LENGTH,
			eTweetLength: 	true
		});
		
		return (
			<div className="bEventHeaderTwitter">
				<If condition={this.props.isTweetButtonRender}>
						<Button
							onClick				= { this.onTwitterButtonClick }
							text				= { [<i key="Twitter" className='fa fa-twitter' aria-hidden='true'></i>, " ", "Tweet"] }
							extraStyleClasses 	= 'eTwitter'
						/>
				</If>
				<If condition={this.state.isPopupOpen}>
					<ConfirmPopup
						isOkButtonDisabled			= { textForTweetLength < 1 || textForTweetLength > TWEET_LENGTH }
						customStyle 				= { 'ePopup' }
						okButtonText 				= { [<i key="Twitter" className='fa fa-twitter' aria-hidden='true'></i>, " ", "Tweet"] }
						cancelButtonText 			= { 'Cancel' }
						handleClickOkButton 		= { this.onPopupOkClick }
						handleClickCancelButton 	= { this.onPopupCancelClick }
					>
						<div className="eTweetTitle">New tweet</div>
						<select
							value 		= { this.state.twitterId }
							className 	= "eTweetAccountChooser"
							onChange 	= { this.onSelectChange }
						>
							{this.renderTwitterAccountChooser()}
						</select>
						<textarea
							name		= "text"
							className	= "eTextArea"
							value		= { textForTweet }
							onChange	= { this.onPopupTextareaChange }
						>
						</textarea>
						<p className = {stylesTweetLength}>
							{ TWEET_LENGTH - textForTweetLength }
						</p>
					</ConfirmPopup>
				</If>
			</div>
		)
	}
});

module.exports = TweetButton;