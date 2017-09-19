const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),
		SessionHelper	= require('module/helpers/session_helper');

const SchoolListPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		var self = this,
            globalBinding = self.getMoreartyContext().getBinding(),
			role = SessionHelper.getRoleFromSession(globalBinding.sub('userData'));

		if(role) {
			window.Server.getMaSchools.get(
				{
					filter: {
						presets:["owner","admin","manager","teacher","coach"],
						include: "postcode"
					}
				}
			).then(function(schoolsList){
				self.getDefaultBinding().set(Immutable.fromJS(schoolsList));
                if(!schoolsList || schoolsList && schoolsList.length === 0)
                    document.location.hash = 'schools/lounge';
                // If there is at least any school making first of them default
                else if (schoolsList.length === 1) {
                    globalBinding.set('userRules.activeSchoolId', schoolsList[0].id);
                    document.location.hash = 'school_admin/summary';
                }
			});
		}
	},
	setSchoolAsActive: function(school) {
		var self = this,
			globalBinding = self.getMoreartyContext().getBinding();

		globalBinding
            .atomically()
            .set('userRules.activeSchoolId', school.id)
            .set('schoolInfo', Immutable.fromJS(school))
            .commit();
	},
	render: function() {
		var self = this,
			schoolNodes,

			binding = self.getDefaultBinding(),
			schoolList = binding.toJS();

		if (schoolList && schoolList.length > 0) {
			schoolNodes = schoolList.map(function (school, schoolIndex) {
				return (
					<a key={school.id}  href='/#school_admin/summary'
                        className="eSchoolList_one"
                        onClick={self.setSchoolAsActive.bind(null, school)}>
                        {school.name}
					</a>
				);
			});
		}

		return (
			<div className="bSchoolList">
				<h2>My schools</h2>

				<div className="eSchoolList_wrap">
					{schoolNodes}
				</div>
			</div>
		)
	}
});


module.exports = SchoolListPage;

/*
*                     <a href="/#schools/add" className="eSchoolList_one mAddNew">
 +
 </a>*/
