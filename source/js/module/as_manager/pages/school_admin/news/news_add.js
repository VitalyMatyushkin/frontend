const 	NewsForm 	= require('module/as_manager/pages/school_admin/news/news_form'),
		Morearty	= require('morearty'),
		React 		= require('react'),
		RoleHelper	= require('module/helpers/role_helper');

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
		const 	self = this;

		const	role		= RoleHelper.getLoggedInUserRole(this),
				schoolKind	= RoleHelper.getActiveSchoolKind(this);

		data.schoolId = self.activeSchoolId;

		self.activeSchoolId && window.Server.schoolNews.post(self.activeSchoolId, data).then( () => {
			//It's so bad, if you see me, fix me, please
			if (role !== "undefined" && schoolKind === "SchoolUnion"){
				document.location.hash = 'school_union_admin/news';
			} else {
				document.location.hash = 'school_admin/news';
			}
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
