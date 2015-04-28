var NewsForm = require('module/as_manager/pages/school_admin/news/news_form'),
	NewsAddPage;

NewsAddPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('userRules.activeSchoolId');

		self.activeSchoolId = activeSchoolId;
	},
	submitAdd: function(data) {
		var self = this;

		data.schoolId = self.activeSchoolId;

		self.activeSchoolId && window.Server.news.post(self.activeSchoolId, data).then(function() {
			document.location.hash = 'school_admin/news';
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<NewsForm title="Add news..." onFormSubmit={self.submitAdd} binding={binding} />
		)
	}
});


module.exports = NewsAddPage;
