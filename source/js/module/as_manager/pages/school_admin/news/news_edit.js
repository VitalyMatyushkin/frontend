const 	NewsForm 	= require('module/as_manager/pages/school_admin/news/news_form'),
		React 		= require('react'),
		Immutable 	= require('Immutable');

const NewsEditPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			routingData = globalBinding.sub('routing.parameters').toJS(),
			newsId = routingData.id;

		binding.clear();

		if (newsId) {
			window.Server.oneNews.get(newsId).then(function (data) {
				self.isMounted() && binding.set(Immutable.fromJS(data));
			});

			self.newsId = newsId;
		}
	},
	submitEdit: function(data) {
		var self = this;

		window.Server.oneNews.put(self.newsId, data).then(function() {
			self.isMounted() && (document.location.hash = 'school_admin/news');
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<NewsForm title="Edit news" onFormSubmit={self.submitEdit} binding={binding} />
		)
	}
});


module.exports = NewsEditPage;
