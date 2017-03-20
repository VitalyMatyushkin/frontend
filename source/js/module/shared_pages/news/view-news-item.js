/**
 * Created by Anatoly on 18.08.2016.
 */
const	React 			= require('react'),
		Immutable 		= require('immutable'),
		Morearty 		= require('morearty'),
		DateTimeMixin	= require('module/mixins/datetime'),
		Button			= require('module/ui/button/button'),
		If				= require('module/ui/if/if'),
		ConfirmPopup 	= require('module/ui/confirm_popup'),
		SchoolHelper 	= require('module/helpers/school_helper'),
		DomainHelper	= require('module/helpers/domain_helper'),
		classNames 		= require('classnames'),
		Promise 		= require('bluebird');

const 	NewsStyle		= require('./../../../../styles/ui/b_school_news.scss'),
		Bootstrap		= require('./../../../../styles/bootstrap-custom.scss');

const ViewNewsItem = React.createClass({
	mixins: [Morearty.Mixin, DateTimeMixin],
	propTypes: {
		value: React.PropTypes.object
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
	
	newsItemMoreInfo: function(id){
		const	binding			= this.getDefaultBinding(),
				currentNewsId	= binding.toJS('selectedNewsItem');

		if(currentNewsId == id) {
			binding.set('selectedNewsItem', Immutable.fromJS(''));
		} else {
			binding.set('selectedNewsItem', Immutable.fromJS(id));
		}
	},
	
	//When the user clicks on the "Tweet" button, we get the news text, school domain and Twitter id, then open the popup window
	onTwitterButtonClick: function(news){
		const 	binding 		= this.getDefaultBinding(),
				activeSchoolId 		= typeof SchoolHelper.getActiveSchoolId(this) !== 'undefined' ? SchoolHelper.getActiveSchoolId(this) : '',
				protocol 			= document.location.protocol + '//',
				textNewsChanged 	= typeof binding.toJS('textForTweet') !== 'undefined' ? binding.toJS('textForTweet') : '';
		
		if (activeSchoolId !== '') {
			
			let textNews;
			let promises = [];
			
			if (textNewsChanged === '' && typeof news !== 'undefined' && typeof news.body !== 'undefined') {
				textNews = news.body + ' ';
			} else {
				textNews = textNewsChanged;
			}
			
			promises.push(
				SchoolHelper.loadActiveSchoolInfo(this).then( data => {
					const domainSchool	= textNewsChanged === '' && typeof data.domain !== 'undefined' && data.publicSite.status === 'PUBLIC_AVAILABLE' ? protocol + DomainHelper.getSubDomain(data.domain) + '/#news' : '';
					binding.set('textForTweet', textNews + domainSchool);
					return true;
				})
			);
			promises.push(
				window.Server.integrations.get({ schoolId : activeSchoolId }).then( integrations => {
					integrations = integrations.filter( integration => {return integration.type === 'twitter'}).map( integration => {return integration.id});
					binding.set('twitterIds', Immutable.fromJS(integrations));
					binding.set('isPopupOpen', true);
					return true;
				})
			);
			Promise.all(promises).then(() => {
				return true;
			});
			
		} else {
			console.log('activeSchoolId undefined');
		}
	},
	//Just close popup window
	onPopupCancelClick: function(){
		const binding	= this.getDefaultBinding();

		binding.set('isPopupOpen', false);
	},
	//When the user clicks on the "Tweet" button in popup window, we send tweet text on server
	onPopupOkClick: function(){
		const 	binding			= this.getDefaultBinding(),
				activeSchoolId 	= typeof SchoolHelper.getActiveSchoolId(this) !== 'undefined' ? SchoolHelper.getActiveSchoolId(this) : '',
				twitterId 		= binding.toJS('twitterIds');
		
		if (activeSchoolId !== '') {
			let data = {};
			
			data.text = this.refs.tweetText.value;
			window.Server.integrationTwitterTweet.post({
				schoolId:	activeSchoolId,
				twitterId:	twitterId[0]
			}, data).then( () => {
				binding.set('isPopupOpen', false);
			});
		} else {
			console.log('activeSchoolId undefined');
		}
	},
	//When field textarea change, we save tweet text, because we want to save the edited text by pressing the tweet button again
	//When field textarea change, we save cursor position, because Because changing the binding causes the component to rerender and then cursor jump in end of field textarea
	onPopupTextareaChange: function(event){
		const 	binding = this.getDefaultBinding();

		binding.set('startPosition', event.target.selectionStart);
		binding.set('textForTweet', event.target.value);
	},
	
	renderNews: function(news) {
		const 	binding				= this.getDefaultBinding(),
				imgStyle 			= news.picUrl ? {backgroundImage: 'url(' + news.picUrl + ')'} : {display: 'none'},
				textForTweet 		= typeof binding.toJS('textForTweet') !== 'undefined' ? binding.toJS('textForTweet') : '',
				activeSchoolId 		= typeof SchoolHelper.getActiveSchoolId(this) !== 'undefined' ? SchoolHelper.getActiveSchoolId(this) : '';

		const stylesTweetLength = classNames({
			mInvalid: 		textForTweet.length > 140,
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
							<div className="eSchoolNewsItem">
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
									<If condition={Boolean(activeSchoolId)}>
										<div className="eSchoolNewsItem_twitter">
											<Button
												onClick				= { () => {this.onTwitterButtonClick(news)} }
												text				= { [<i key="Twitter" className='fa fa-twitter' aria-hidden='true'></i>, " ", "Tweet"] }
												extraStyleClasses 	= 'eTwitter'
											/>
										</div>
									</If>
									<If condition={Boolean(news && news.body && news.body.length > 100)}>
										<span className="eSchoolNews_more" onClick={this.newsItemMoreInfo.bind(this, news.id)}>
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
						isOkButtonDisabled			= { Boolean(textForTweet.length > 140) }
						customStyle 				= { 'ePopup' }
						okButtonText 				= { [<i key="Twitter" className='fa fa-twitter' aria-hidden='true'></i>, " ", "Tweet"] }
						cancelButtonText 			= { 'Cancel' }
						handleClickOkButton 		= { this.onPopupOkClick }
						handleClickCancelButton 	= { this.onPopupCancelClick }
					>
						<div className="eTweetTitle">New tweet</div>
						<textarea
							ref			= "tweetText"
							name		= "text"
							className	= "eTextArea"
							value		= { textForTweet }
							onChange	= { this.onPopupTextareaChange }
						>
						</textarea>
						<p className = {stylesTweetLength}>
							{textForTweet.length <= 140 ? textForTweet.length : 140 - textForTweet.length}
						</p>
					</ConfirmPopup>
				</If>
			</div>
		);
	},
	
	render: function() {
		const	self	= this;

		return self.renderNews(self.props.value) || null;
	}
});

module.exports = ViewNewsItem;