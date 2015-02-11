var SchoolListPage;

SchoolListPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		var self = this,
			userId = self.getMoreartyContext().getBinding().sub('userData.authorizationInfo').get('userId');

		Server.ownerSchools.get(userId).then(function(data) {
			self.getDefaultBinding().update(function(){
				return Immutable.List(data);
			});
		});

	},
	render: function() {
		var self = this,
			schoolNodes,
			binding = self.getDefaultBinding(),
			schoolList = binding.get();




		if (schoolList) {

			schoolNodes = schoolList.toArray().map(function (school) {
				var schoolLink = '#school?id=' + school.id;

				return (
					<a href={schoolLink} className="eSchoolList_one">
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
