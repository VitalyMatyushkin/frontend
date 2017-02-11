/**
 * Created by Anatoly on 18.08.2016.
 */
const	React 			= require('react'),
		Immutable 		= require('immutable'),
		Morearty        = require('morearty'),
		DateTimeMixin	= require('module/mixins/datetime');

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
					<span className="eSchoolNewsDateText">{self.getDateFromIso(news.date)}</span>
					<span className="eSchoolNewsDateText">{self.getTimeFromIso(news.date)}</span>
				</div>
			)
		}
	},
	renderRows:function(rows){
		return (
			<div className="inlineBlock newsItemText">
				{rows.map(row => {
					return <p>{row}</p>;
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
				imgStyle 	= {backgroundImage: 'url(' + news.picUrl + ')'};

		let	text, linkText;
		if(binding.toJS('selectedNewsItem') == news.id) {
			text = this.getFullNewsText(news.body);
			linkText = 'Less info'
		} else {
			text = this.getNewsExcerpt(news.body);
			linkText = 'More info'
		}

		return (
			<div className="eSchoolNewsItem">
				<div className="eSchoolNewsImage" style={imgStyle}>
					
				</div>
				<div className="eSchoolNewsItemDescription">
					<div className="eSchoolNewsItemInfo">
						<h1 className="inlineBlock newsItemTitle">{news.title}</h1>
						<div className="eSchoolNewsItemDate">
							{this.getNewsDate(news)}
						</div><hr/>
						{text}
					</div>
					<span	className="eSchoolNewsMoreInfo"
							onClick={this._newsItemMoreInfo.bind(this, news.id)}
					>
						{linkText}
					</span>
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