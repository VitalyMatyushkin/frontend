// @flow
/**
 * Created by Woland on 21.03.2017.
 */
const	React 				= require('react'),
		Button				= require('module/ui/button/button'),
		If					= require('module/ui/if/if'),
		ConfirmPopup 		= require('module/ui/confirm_popup'),
		classNames 			= require('classnames');

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
		let data = {};
		data.text = this.state.textForTweet;
		
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
	
	onPopupTextareaChange: function(event){
		this.setState({
			textForTweet: event.target.value
		});
	},
	
	onSelectChange: function(event){
		this.setState({twitterId: event.target.value});
	},
	
	render: function(){
		const 	textForTweet = this.state.textForTweet,
				startLinkPos = textForTweet.indexOf(' http'),
				endLinkPos = textForTweet.indexOf(' ', startLinkPos + 1),
				textWithoutLink = startLinkPos !== - 1 ? textForTweet.substring(startLinkPos + 1, endLinkPos + 1) : textForTweet;

		const stylesTweetLength = classNames({
			mInvalid: 		textWithoutLink.length > 110,
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
						isOkButtonDisabled			= { textWithoutLink.length < 1 || textWithoutLink.length > 110 /*|| !isTwitterAccountSet*/ }
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
							ref			= "tweetText"
							name		= "text"
							className	= "eTextArea"
							value		= { textForTweet }
							onChange	= { this.onPopupTextareaChange }
						>
						</textarea>
						<p className = {stylesTweetLength}>
							{ 110 - textWithoutLink.length }
						</p>
					</ConfirmPopup>
				</If>
			</div>
		)
	}
});

module.exports = TweetButton;