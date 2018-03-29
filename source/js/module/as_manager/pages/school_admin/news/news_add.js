const 	NewsForm 	= require('module/as_manager/pages/school_admin/news/news_form'),
		Morearty	= require('morearty'),
		React 		= require('react'),
		{DateHelper}= require('module/helpers/date_helper'),
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
		const 	globalBinding = this.getMoreartyContext().getBinding(),
				activeSchoolId = globalBinding.get('userRules.activeSchoolId');

		this.activeSchoolId = activeSchoolId;
	},
	submitAdd: function(data) {
		const	role		= RoleHelper.getLoggedInUserRole(this),
				schoolKind	= RoleHelper.getActiveSchoolKind(this);

		data.schoolId = this.activeSchoolId;

		if (data.date){
			data.date = DateHelper.getFormatDateTimeUTCString(data.date);
		}
		
		this.activeSchoolId && window.Server.schoolNews.post(this.activeSchoolId, data).then( () => {
			//It's so bad, if you see it, fix it, please
			if (role !== "undefined" && schoolKind === "SchoolUnion"){
				document.location.hash = 'school_union_admin/news';
			} else {
				document.location.hash = 'school_admin/news';
			}
		});
	},
	render: function() {
		const binding = this.getDefaultBinding();

		return (
				<div className="bNewsEdit">
					<NewsTitle />
					<NewsForm title="Add news" onFormSubmit={this.submitAdd} binding={binding} region={this.props.region}/>
				</div>
			)
	}
});


module.exports = NewsAddPage;
