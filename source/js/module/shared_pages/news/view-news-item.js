/**
 * Created by Anatoly on 18.08.2016.
 */
const	React 				= require('react'),
		Immutable 			= require('immutable'),
		Morearty 			= require('morearty'),
		DateTimeMixin		= require('module/mixins/datetime'),
		Button				= require('module/ui/button/button'),
		If					= require('module/ui/if/if'),
		ConfirmPopup 		= require('module/ui/confirm_popup'),
		classNames 			= require('classnames');

const 	SchoolHelper 		= require('module/helpers/school_helper'),
		DomainHelper 		= require('module/helpers/domain_helper'),
		RoleHelper 			= require('module/helpers/role_helper'),
		TwitterHelper 		= require('module/helpers/twitter_helper');

const 	NewsStyle		= require('./../../../../styles/ui/b_school_news.scss'),
		Bootstrap		= require('./../../../../styles/bootstrap-custom.scss');

const 	TWEET_LENGTH 		= 140,
		TWEET_LINK_LENGTH 	= 30; //usually it value get from twitter api, but we go to easy way

const ViewNewsItem = React.createClass({
	mixins: [Morearty.Mixin, DateTimeMixin],
	propTypes: {
		value: React.PropTypes.object.isRequired
	},

	//Temporarily remove img from news body
	getNewsDate:function(news){
		if(news !== undefined){
			return (
				<div>
					{this.getDateFromIso(news.date) + ", "}
					{this.getTimeFromIso(news.date)}
				</div>
			)
		}
	},
	//Load all user integrations from server, because we want button "tweet" only user with twitter integration
	//Note: We do not care when promises are made, because we use this data only if user click button "tweet"
	componentWillMount: function(){
		const 	binding 		= this.getDefaultBinding(),
				activeSchoolId 	= typeof SchoolHelper.getActiveSchoolId(this) !== 'undefined' ? SchoolHelper.getActiveSchoolId(this) : '',
				role 			= typeof RoleHelper.getLoggedInUserRole(this) !== 'undefined' ? RoleHelper.getLoggedInUserRole(this) : '',
				protocol 		= document.location.protocol + '//';

		if (activeSchoolId !== '' && role === RoleHelper.USER_ROLES.ADMIN) { //TODO When the server is ready, delete it
			
			window.Server.integrations.get({ schoolId : activeSchoolId }).then( integrations => {
				//we choose only twitter integrations
				integrations = integrations.filter( integration => integration.type === 'twitter');
				if (integrations.length > 0) {
					binding.atomically()
						.set('twitterData', 	Immutable.fromJS(integrations))
						.set('twitterId', 		Immutable.fromJS(integrations[0].id)) // while we wait isFavorite from server, we made isFavorite first id
						.commit();
				}
				return true;
			});
			
			SchoolHelper.loadActiveSchoolInfo(this).then( data => {
				if (data.publicSite.status === 'PUBLIC_AVAILABLE') {
					binding.set('linkForTweet', protocol + DomainHelper.getSubDomain(data.domain) + '/#news');
				} else {
					binding.set('linkForTweet', '');
				}
				return true;
			});
		}
	},
	componentWillUnmount: function(){
		const binding = this.getDefaultBinding();
		binding.clear();
	},
	
	//We save cursor position in binding, and when component rerender we display right cursor position
	//I don't know, how make it better
	componentDidUpdate: function(){
		const binding = this.getDefaultBinding();
		
		if (typeof this.refs.tweetText !== 'undefined') {
			const startPosition = typeof binding.toJS('startPosition') !== 'undefined' ? binding.toJS('startPosition') : this.refs.tweetText.value.length;
			this.refs.tweetText.setSelectionRange (startPosition, startPosition);
		}
	},
	
	renderRows:function(rows){
		return (
			<div>
				{rows.map((row, index) => {
					return <p key={index}>{row}</p>;
				})}
			</div>
		);
	},
	
	getNewsExcerpt:function(newsBody){
		if(newsBody){
			const rows = newsBody.slice(0,100).split('\n').splice(0,2);
			return this.renderRows(rows);
		}
	},
	
	getFullNewsText: function(newsBody){
		if(newsBody){
			const rows = newsBody.split('\n');
			return this.renderRows(rows);
		}
	},
	
	newsItemMoreInfo: function(newsId, event){
		const	binding			= this.getDefaultBinding(),
				currentNewsId	= binding.toJS('selectedNewsItem');

		if(currentNewsId === newsId) {
			binding.set('selectedNewsItem', Immutable.fromJS(''));
		} else {
			binding.set('selectedNewsItem', Immutable.fromJS(newsId));
		}
		event.stopPropagation();
	},
	
	//When the user clicks on the "Tweet" button, we get the news text, then open the popup window
	onTwitterButtonClick: function(news){
		const 	binding 			= this.getDefaultBinding(),
				textNewsChanged 	= typeof binding.toJS('textForTweet') !== 'undefined' ? binding.toJS('textForTweet') : '',
				linkForTweet 		= textNewsChanged === '' ? binding.toJS('linkForTweet') : '';

		let textNews;

		if (textNewsChanged === '' && typeof news !== 'undefined' && typeof news.body !== 'undefined') {
			textNews = news.body + ' ';
		} else {
			textNews = textNewsChanged;
		}

		binding.set('textForTweet', textNews + linkForTweet);
		binding.set('isPopupOpen', true);
	},
	
	//Just close popup window
	onPopupCancelClick: function(){
		const binding	= this.getDefaultBinding();

		binding.set('isPopupOpen', false);
	},
	
	//When the user clicks on the "Tweet" button in popup window, we send tweet text on server and then display alert "Success"
	onPopupOkClick: function(){
		const 	binding			= this.getDefaultBinding(),
				activeSchoolId 	= typeof SchoolHelper.getActiveSchoolId(this) !== 'undefined' ? SchoolHelper.getActiveSchoolId(this) : '',
				twitterId 		= binding.toJS('twitterId');

		if (activeSchoolId !== '') {
			let data = {};
			
			data.text = this.refs.tweetText.value;
			window.Server.integrationTwitterTweet.post({
				schoolId:	activeSchoolId,
				twitterId:	twitterId
			}, data).then( () => {
				binding.set('isPopupOpen', false);
				window.simpleAlert(
					'Success published!',
					'Ok',
					() => {}
				);
			});
		} else {
			console.log('activeSchoolId undefined');
		}
	},
	
	//When field textarea change, we save tweet text, because we want to save the edited text by pressing the tweet button again
	//When field textarea change, we save cursor position, because changing the binding causes the component to rerender and then cursor jump in end of field textarea
	onPopupTextareaChange: function(event){
		const 	binding = this.getDefaultBinding();

		binding.set('startPosition', event.target.selectionStart);
		binding.set('textForTweet', event.target.value);
	},
	
	onTweetAccountChange: function(event){
		const binding = this.getDefaultBinding();
		
		binding.set('twitterId', event.target.value);
	},
	
	//If a user has more than one twitter account, we give him the choice of which account to make a tweet
	renderTwitterAccountChooser: function(){
		const 	binding			= this.getDefaultBinding(),
				twitterData 	= typeof binding.toJS('twitterData') !== 'undefined' ? binding.toJS('twitterData') : [];
		
		return twitterData.map( twitterItem => {
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
	
	onNewsItemClick: function(activeSchoolId, newsId){
		if (activeSchoolId === '') {
			document.location.hash = 'news_view/' + newsId;
		}
	},
	
	renderNews: function(news) {
		const 	binding				= this.getDefaultBinding(),
				imgStyle 			= news.picUrl ? {backgroundImage: 'url(' + news.picUrl + ')'} : {display: 'none'},
				activeSchoolId 		= typeof SchoolHelper.getActiveSchoolId(this) !== 'undefined' ? SchoolHelper.getActiveSchoolId(this) : '',
				twitterId 			= typeof binding.toJS('twitterId') !== 'undefined' ? binding.toJS('twitterId') : '',
				isTwitterAccount 	= Boolean(binding.toJS('twitterId')),
				textForTweetFull	= typeof binding.toJS('textForTweet') !== 'undefined' ? binding.toJS('textForTweet') : '',
				numberLinksInTweet 	= TwitterHelper.getNumberLinksInTweet(textForTweetFull),
				textForTweetLength 	= numberLinksInTweet > 0 ? TwitterHelper.getTextWithoutLinkLength(textForTweetFull, numberLinksInTweet) + (TWEET_LINK_LENGTH * numberLinksInTweet) : textForTweetFull.length;

		if (textForTweetFull === '') {
			binding.set('textForTweet', textForTweetFull);
		}

		const stylesTweetLength = classNames({
			mInvalid: 		textForTweetLength > TWEET_LENGTH,
			eTweetLength: 	true
		});
		
		let	text, linkText, iconStyle;
		if(binding.toJS('selectedNewsItem') === news.id) {
			text = this.getFullNewsText(news.body);
			linkText = 'Less info';
			iconStyle = 'eSchoolNews_arrow fa fa-angle-up'
		} else {
			text = this.getNewsExcerpt(news.body);
			linkText = 'More info';
			iconStyle = 'eSchoolNews_arrow fa fa-angle-down'
		}

		return (
			<div className="bSchoolNewsItem">
				<div className="eSchoolNewsItem_container">
					<div className="eSchoolNewsItem_row">
						<div className="eSchoolNewsItem_col_medium_10">
							<div className="eSchoolNewsItem" onClick={() => {this.onNewsItemClick(activeSchoolId, news.id)}}>
								<div className="eSchoolNewsImage" style={imgStyle}>
								</div>
								<div className="eSchoolNewsItemDescription">
									<div className="eSchoolNewsItemInfo">
										<h1 className="eSchoolNewsItem_title">{news.title}</h1>
										<div className="eSchoolNewsItem_date">
											{this.getNewsDate(news)}
										</div>
										<div className="eSchoolNewsItem_text">
											{text}
										</div>
									</div>
									<If condition={ Boolean(activeSchoolId) && isTwitterAccount }>
										<div className="eSchoolNewsItem_twitter">
											<Button
												onClick				= { () => {this.onTwitterButtonClick(news)} }
												text				= { [<i key="Twitter" className='fa fa-twitter' aria-hidden='true'></i>, " ", "Tweet"] }
												extraStyleClasses 	= 'eTwitter'
											/>
										</div>
									</If>
									<If condition={ Boolean(news && news.body && news.body.length > 100) }>
										<span className="eSchoolNews_more" onClick={ event => {this.newsItemMoreInfo(news.id, event)} }>
											<i className={iconStyle} aria-hidden="true"></i>
											{linkText}
										</span>
									</If>
								</div>
							</div>
						</div>
					</div>
				</div>
				<If condition={Boolean(binding.toJS('isPopupOpen'))}>
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
							value 		= { twitterId }
							className 	= "eTweetAccountChooser"
							onChange 	= { this.onTweetAccountChange }
						>
							{this.renderTwitterAccountChooser()}
						</select>
						<textarea
							ref			= "tweetText"
							name		= "text"
							className	= "eTextArea"
							value		= { textForTweetFull }
							onChange	= { this.onPopupTextareaChange }
						>
						</textarea>
						<p className = {stylesTweetLength}>
							{TWEET_LENGTH - textForTweetLength}
						</p>
					</ConfirmPopup>
				</If>
			</div>
		);
	},
	
	render: function() {
		return this.renderNews(this.props.value);
	}
});

module.exports = ViewNewsItem;