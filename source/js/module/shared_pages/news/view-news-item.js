/**
 * Created by Anatoly on 18.08.2016.
 */
const	React 			= require('react'),
		Immutable 		= require('immutable'),
		Morearty        = require('morearty'),
		DateTimeMixin	= require('module/mixins/datetime'),
		NewsStyle		= require('./../../../../styles/ui/b_school_news.scss'),
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
					<span>{self.getDateFromIso(news.date) + ", "}</span>
					<span>{self.getTimeFromIso(news.date)}</span>
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
	renderNews: function(news) {
		const 	binding		= this.getDefaultBinding(),
				imgStyle 	= news.picUrl ? {backgroundImage: 'url(' + news.picUrl + ')'} : {display: 'none'};

		let	text, linkText, iconStyle;
		if(binding.toJS('selectedNewsItem') == news.id) {
			text = this.getFullNewsText(news.body);
			linkText = 'Less info';
			iconStyle = 'fa fa-angle-up'
		} else {
			text = this.getNewsExcerpt(news.body);
			linkText = 'More info';
			iconStyle = 'fa fa-angle-down'
		}

		return (
			<div className="row">
				<div className="col-md-10 col-md-offset-1">
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
					<span className="eSchoolNews_more" onClick={this._newsItemMoreInfo.bind(this, news.id)}>
						<i className={iconStyle} aria-hidden="true"></i>
						{linkText}
					</span>
						</div>
					</div>
				</div>
			</div>
		);
	},
	render: function() {
		const	self	= this;

		return self.renderNews(self.props.value) || null;
	}
});

module.exports = ViewNewsItem;