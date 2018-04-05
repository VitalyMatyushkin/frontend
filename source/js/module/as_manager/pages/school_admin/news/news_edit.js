const 	NewsForm 	= require('module/as_manager/pages/school_admin/news/news_form'),
		React 		= require('react'),
		Morearty	= require('morearty'),
		Immutable 	= require('immutable'),
		{DateHelper}= require('module/helpers/date_helper'),
		Loader	    = require('module/ui/loader'),
		RoleHelper	= require('module/helpers/role_helper');

const NewsTitle = React.createClass({
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
		const 	binding 		= this.getDefaultBinding(),
				globalBinding 	= this.getMoreartyContext().getBinding(),
				routingData 	= globalBinding.sub('routing.parameters').toJS(),
				newsId 			= routingData.id,
				schoolId		= globalBinding.get('userRules.activeSchoolId');

		binding.clear();

		if (newsId) {
			window.Server.schoolNewsItem.get({schoolId:schoolId,newsId:newsId})
				.then(data => {
					binding.set(Immutable.fromJS(data));
					binding.set('isSync', true);
				});

			this.newsId 	= newsId;
			this.schoolId 	= schoolId;
		}
	},
	submitEdit: function(data) {
		const	role		= RoleHelper.getLoggedInUserRole(this),
				schoolKind	= RoleHelper.getActiveSchoolKind(this);
		
		if (data.date){
			data.date = DateHelper.getFormatDateTimeUTCStringByRegion(data.date, this.props.region);
		}
		
		window.Server.schoolNewsItem.put({schoolId:this.schoolId, newsId:this.newsId}, data).then(() => {
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
				{
					binding.get('isSync') ?
					<NewsForm title="Edit news" onFormSubmit={this.submitEdit} binding={binding} region={this.props.region}/>
					:
					<Loader/>
				}
			</div>
		);

	}
});


module.exports = NewsEditPage;
