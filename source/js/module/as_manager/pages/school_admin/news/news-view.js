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
		const 	binding 		= this.getDefaultBinding(),
				globalBinding 	= this.getMoreartyContext().getBinding(),
				routingData 	= globalBinding.sub('routing.parameters').toJS(),
				newsId 			= routingData.id,
				schoolId		= globalBinding.get('userRules.activeSchoolId');

		binding.set('isSync', false);
		
		if (newsId) {
			window.Server.schoolNewsItem.get({schoolId:schoolId,newsId:newsId})
				.then(data => {
					binding.set('news', Immutable.fromJS(data));
					binding.set('isSync', true);
			});
		}
	},
	render: function() {
		const 	binding = this.getDefaultBinding();
		
		if (binding.toJS('isSync') === true) {
			const news = binding.toJS('news');
			return (
				<div className="eSchoolNewsContainer">
					<div className="eSchoolNewsItems">
						<NewsItem value={news} binding={binding.sub('viewItem')} />
					</div>
				</div>
			);
		} else {
			return null
		}
	}
});


module.exports = NewsViewPage;
