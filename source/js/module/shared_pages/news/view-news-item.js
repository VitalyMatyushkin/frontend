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
		DomainHelper	= require('module/helpers/domain_helper');

const 	NewsStyle		= require('./../../../../styles/ui/b_school_news.scss'),
		Bootstrap		= require('./../../../../styles/bootstrap-custom.scss');

const ViewNewsItem = React.createClass({
	mixins: [Morearty.Mixin, DateTimeMixin],
	propTypes: {
		value: React.PropTypes.object
	},

	//Temporarily remove img from news body
	getNewsDate:function(news){
		const	self	= this;

		if(news !== undefined){
			return (
				<div>
					{self.getDateFromIso(news.date) + ", "}
					{self.getTimeFromIso(news.date)}
				</div>
			)
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
	getFullNewsText: function(newsBody) {
		if(newsBody){
			const rows = newsBody.split('\n');
			return this.renderRows(rows);
		}
	},
	_newsItemMoreInfo: function(id) {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				currentNewsId	= binding.toJS('selectedNewsItem');

		if(currentNewsId == id) {
			binding.set('selectedNewsItem', Immutable.fromJS(''));
		} else {
			binding.set('selectedNewsItem', Immutable.fromJS(id));
		}
	},
	onTwitterClick: function(news){
		const 	binding		= this.getDefaultBinding(),
				rootBinding = this.getMoreartyContext().getBinding();
		const activeSchoolId = SchoolHelper.getActiveSchoolId(this);
		//TODO Make wrap promise.all
		SchoolHelper.loadActiveSchoolInfo(this)
		.then( data => {
			binding.set('schoolDomain', data.domain);
			return window.Server.integrations.get({schoolId:activeSchoolId})
		})
		.then( integrations => {
			integrations = integrations.filter( integration => {return integration.type === 'twitter'}).map( integration => {return integration.id});
			binding.set('twitterIds', Immutable.fromJS(integrations));
			binding.set('isPopupOpen', true);
		});
	},
	
	onPopupCancelClick: function(){
		const binding	= this.getDefaultBinding();

		binding.set('isPopupOpen', false);
	},
	
	onPopupOkClick: function(){
		const 	binding			= this.getDefaultBinding(),
				activeSchoolId 	= SchoolHelper.getActiveSchoolId(this),
				twitterId 		= binding.toJS('twitterIds');
		let data = {};
		data.text = this.refs.tweetText.value;
		window.Server.integrationTwitterTweet.post({
			schoolId:	activeSchoolId,
			twitterId:	twitterId[0]
		}, data).then( response => {
			console.log(response);
			binding.set('isPopupOpen', false);
		})
	},
	
	
	renderNews: function(news) {
		const 	binding			= this.getDefaultBinding(),
				imgStyle 		= news.picUrl ? {backgroundImage: 'url(' + news.picUrl + ')'} : {display: 'none'},
				textForTwitter 	= typeof news !== 'undefined' && typeof news.body !== 'undefined' ? news.body.slice(0, 129) : '',
				domainForTwitter= typeof binding.toJS('schoolDomain') !== 'undefined' ? DomainHelper.getSubDomain(binding.get('schoolDomain')) : '';

		let	text, linkText, iconStyle;
		if(binding.toJS('selectedNewsItem') == news.id) {
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
									<div className="eSchoolNewsItem_twitter">
										<Button
											onClick				= { () => {this.onTwitterClick(news)} }
											text				= { [<i key="Twitter" className='fa fa-twitter' aria-hidden='true'></i>, " ", "Tweet"] }
											extraStyleClasses 	= 'eTwitter'
										/>
									</div>
									<If condition={Boolean(news && news.body && news.body.length > 100)}>
										<span className="eSchoolNews_more" onClick={this._newsItemMoreInfo.bind(this, news.id)}>
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
						customStyle 				= { 'ePopup' }
						okButtonText 				= { [<i key="Twitter" className='fa fa-twitter' aria-hidden='true'></i>, " ", "Tweet"] }
						cancelButtonText 			= { 'Cancel' }
						handleClickOkButton 		= { this.onPopupOkClick }
						handleClickCancelButton 	= { this.onPopupCancelClick }
					>
						<div>You want tweet it? You are crazy?</div>
						<textarea ref="tweetText" name="text" className="eTextArea" value={textForTwitter + ' ' + domainForTwitter + '/#news'}></textarea>
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