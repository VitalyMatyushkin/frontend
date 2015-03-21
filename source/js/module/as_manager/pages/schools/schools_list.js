var SchoolListPage;

SchoolListPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		var self = this,
			userId = self.getMoreartyContext().getBinding().get('userData.authorizationInfo.userId');

		userId && Server.ownerSchools.get(userId).then(function(data) {
			self.getDefaultBinding().set(Immutable.fromJS(data));
		});
	},
	setSchoolAsActive: function(newSchoolId) {
		var self = this,
			globalBinding = self.getMoreartyContext().getBinding();

		globalBinding.set('userRules.activeSchoolId', newSchoolId);
	},
	render: function() {
		var self = this,
			schoolNodes,

			binding = self.getDefaultBinding(),
			schoolList = binding.toJS();

		if (schoolList && schoolList.length > 0) {
			schoolNodes = schoolList.map(function (school) {
				var setSchoolFunction = function(newId) {
					return function() {
						self.setSchoolAsActive(newId)
					}
				};

				return (
					<a href='/#school_admin/summary' className="eSchoolList_one" onClick={setSchoolFunction(school.id)}>
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
                    <a href="/#schools/add" className="eSchoolList_one mAddNew">
                        +
                    </a>
				</div>
			</div>
		)
	}
});


module.exports = SchoolListPage;
