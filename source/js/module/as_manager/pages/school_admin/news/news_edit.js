const 	NewsForm 	= require('module/as_manager/pages/school_admin/news/news_form'),
		React 		= require('react'),
		Immutable 	= require('immutable');

var NewsTitle = React.createClass({
	render: function() {
		return (
				<div className="eSchoolMaster_wrap">
					<h1 className="eSchoolMaster_title">Edit news</h1>
					<div className="eStrip">
					</div>
				</div>
		)}
});
const NewsEditPage = React.createClass({
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
				self.isMounted() && binding.set(Immutable.fromJS(data));
			});

			self.newsId 	= newsId;
			self.schoolId 	= schoolId;
		}
	},
	submitEdit: function(data) {
		const self = this;
		window.Server.schoolNewsItem.put({schoolId:self.schoolId,newsId:self.newsId}, data).then(function() {
			self.isMounted() && (document.location.hash = 'school_admin/news');
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
				<div className="bNewsEdit">
					<NewsTitle />
					<NewsForm title="Edit news" onFormSubmit={self.submitEdit} binding={binding}/>
				</div>
					)
	}
});


module.exports = NewsEditPage;
