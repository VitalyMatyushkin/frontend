const	React			= require('react'),
		Immutable 		= require('immutable'),
		Morearty        = require('morearty'),
		NewsItem 		= require('module/shared_pages/news/view-news-item'),
		NewsStyle		= require('./../../../../../styles/ui/b_school_news.scss'),
		Bootstrap		= require('./../../../../../styles/bootstrap-custom.scss');

const HomeNews = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				rootBinding		= self.getMoreartyContext().getBinding(),
				activeSchoolId	= rootBinding.get('activeSchoolId');

		if(activeSchoolId !== undefined || activeSchoolId !== null){
			window.Server.publicSchoolNews.get({schoolId:activeSchoolId}, {filter:{order:"date DESC"}})
				.then(news => {
					binding.atomically()
						.set('schoolNews',			Immutable.fromJS(news))
						.set('selectedNewsItem',	Immutable.fromJS(''))
						.commit();
				});
		}
	},
	renderNewsItems: function() {
		const	self	= this,
				binding	= self.getDefaultBinding(),
				newsList	= binding.toJS('schoolNews');

		if(newsList !== undefined){
			return newsList.map(news => <NewsItem key={news.id} value={news} binding={binding} />);
		}
	},
	render: function() {
		const	self	= this,
				news	= self.renderNewsItems();

		return (
			<div className="bSchoolNewsContainer" id="eSchoolNews">
				<h1 className="eSchoolNewsContainer_title">News</h1>
				<div className="eSchoolNewsItems container">
					{news}
				</div>
			</div>
		);
	}
});

module.exports = HomeNews;