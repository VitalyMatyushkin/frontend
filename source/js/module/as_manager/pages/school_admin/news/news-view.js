/**
 * Created by Anatoly on 18.08.2016.
 */
const 	NewsItem 	= require('module/shared_pages/news/view-news-item'),
		React 		= require('react'),
		Morearty	= require('morearty'),
		Immutable 	= require('immutable');

const NewsViewPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	self 			= this,
				binding 		= self.getDefaultBinding(),
				globalBinding 	= self.getMoreartyContext().getBinding(),
				routingData 	= globalBinding.sub('routing.parameters').toJS(),
				newsId 			= routingData.id,
				schoolId		= globalBinding.get('userRules.activeSchoolId');

		binding.clear();

		if (newsId) {
			window.Server.schoolNewsItem.get({schoolId:schoolId,newsId:newsId})
				.then(function (data) {
					binding.set(Immutable.fromJS(data));
			});

			self.newsId 	= newsId;
			self.schoolId 	= schoolId;
		}
	},
	render: function() {
		const 	self 	= this,
				binding = self.getDefaultBinding(),
				news = binding.toJS();

		return (
			<div className="eSchoolNewsContainer">
				<div className="eSchoolNewsItems">
					{news ? <NewsItem value={news} binding={binding.sub('viewItem')} /> : 'loading...'}
				</div>
			</div>
		);
	}
});


module.exports = NewsViewPage;
