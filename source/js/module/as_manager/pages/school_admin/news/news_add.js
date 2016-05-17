const 	NewsForm 	= require('module/as_manager/pages/school_admin/news/news_form'),
		React 		= require('react');

const NewsTitle = React.createClass({
	render: function() {
	return (
			<div className="eSchoolMaster_wrap">
				<h1 className="eSchoolMaster_title">Add news</h1>
				<div className="eStrip">
				</div>
			</div>
				)}
});

const NewsAddPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	self = this,
				globalBinding = self.getMoreartyContext().getBinding(),
				activeSchoolId = globalBinding.get('userRules.activeSchoolId');

		self.activeSchoolId = activeSchoolId;
	},
	submitAdd: function(data) {
		const self = this;

		data.schoolId = self.activeSchoolId;

		self.activeSchoolId && window.Server.schoolNews.post(self.activeSchoolId, data).then( () => {
			document.location.hash = 'school_admin/news';
		});
	},
	render: function() {
		const 	self 	= this,
				binding = self.getDefaultBinding();

		return (
				<div className="bNewsEdit">
					<NewsTitle />
					<NewsForm title="Add news" onFormSubmit={self.submitAdd} binding={binding}/>
				</div>
			)
	}
});


module.exports = NewsAddPage;
