const	React			= require('react'),
		Immutable 		= require('immutable'),
		DateTimeMixin	= require('module/mixins/datetime'),
		Superuser		= require('module/helpers/superuser');

const HomeNews = React.createClass({
	mixins: [Morearty.Mixin, DateTimeMixin],
	componentWillMount: function() {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				rootBinding		= self.getMoreartyContext().getBinding(),
				activeSchoolId	= rootBinding.get('activeSchoolId');

		if(activeSchoolId !== undefined || activeSchoolId !== null){
			window.Server.publicSchoolNews.get({schoolId:activeSchoolId})
				.then(news =>{
					console.log(news);
					binding.atomically()
						.set('schoolNews',Immutable.fromJS(news))
						.set('selectedNewsItem',Immutable.fromJS(''))
						.commit();
				},error=>{
					console.log('shit happened '+error);
				}).catch(failed =>{
					console.log('failed '+failed);
				});
		}

		//TODO: Do we need this as we now have public and private views?
		// Superuser.runAsSuperUser(rootBinding, () => {
		// 	window.Server.news
		// 		.get(
		// 		{
		// 			schoolId: activeSchoolId,
		// 			filter: {
		// 				order: 'date DESC',
		// 				limit: 20
		// 			}
		// 		})
		// 		.then((schoolNews) => {
		// 			binding.atomically()
		// 				.set('schoolNews',Immutable.fromJS(schoolNews))
		// 				.set('selectedNewsItem',Immutable.fromJS(''))
		// 				.commit();
		// 		});
		// });
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
	getNewsExcerpt:function(newsBody){
		if(newsBody !== undefined){
			return (
				<p>
					{newsBody.slice(0,100)}
				</p>
			);
		}
	},
	getFullNewsText: function(newsBody) {
		if(newsBody !== undefined){
			return (
				<p>{newsBody}</p>
			);
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
	_renderLatestNews: function(news) {

	},
	_renderNews: function(news) {
		const	self	= this,
				binding	= self.getDefaultBinding(),
				imgSrc = news.picUrl;

		let	text;
		if(binding.toJS('selectedNewsItem') == news.id) {
			text = self.getFullNewsText(news.body);
		} else {
			text = self.getNewsExcerpt(news.body);
		}

		return (
			<div key={news.id} className="eSchoolNewsItem">
				<span className="eSchoolNewsImage">
						<img src={imgSrc}/>
				</span>
				<div className="eSchoolNewsItemDescription">
					<div className="eSchoolNewsItemInfo">
						<h1 className="inlineBlock newsItemTitle">{news.title}</h1>
						<div className="eSchoolNewsItemDate">
							{self.getNewsDate(news)}
						</div><hr/>
						<span className="inlineBlock newsItemExcerpt">{text}</span>
					</div>
					<span	className="eSchoolNewsMoreInfo"
							onClick={self._newsItemMoreInfo.bind(self, news.id)}
					>
						More Info
					</span>
				</div>
			</div>
		);
	},
	renderNewsItems: function() {
		const	self	= this,
				binding	= self.getDefaultBinding(),
				news	= binding.toJS('schoolNews');

		if(news !== undefined){
			return news.map(function(newsData, i){
				let	news;

				if (i == 0) {
					//news = self._renderLatestNews(newsData);
					news = self._renderNews(newsData);
				} else {
					news = self._renderNews(newsData);
				}

				return news;
			});
		}
	},
	render: function() {
		const	self	= this,
				news	= self.renderNewsItems();

		return (
			<div className="eSchoolNewsContainer">
				<div className="eSchoolFixtureTab eNews_tab">
					<h1>News</h1><hr/>
					<span></span>
				</div>
				<div className="eSchoolNewsItems">
					{news}
				</div>
			</div>
		);
	}
});

module.exports = HomeNews;