var SchoolListPage,
	React = require('react');

SchoolListPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		var self = this,
			userId = self.getMoreartyContext().getBinding().get('userData.authorizationInfo.userId');

		if(userId !== null && userId !== undefined) {
			window.Server.getMaSchools.get(
				{
					filter: {
						presets:["owner","admin","manager","teacher","coach"],
						include: "postcode"
					}
				}
			).then(function(data){
				self.getDefaultBinding().set(Immutable.fromJS(data));
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
					<a key={schoolIndex}  href='/#school_admin/summary'
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
