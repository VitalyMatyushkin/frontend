var SchoolListPage;

SchoolListPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		var self = this,
			token = self.getMoreartyContext().getBinding().sub('userData.authorizationInfo').get('userId');

		if (self.requset && self.requset.abort) {
			self.requset.abort();
		}

		self.requset = $.ajax({
			url: 'http://api.squadintouch.com/v1/schools?filter[where][ownerId]=' + token,
			type: 'GET',
			crossDomain: true,
			error: function(data, error, errorText) {
				debugger
			},
			success: function(data) {
				self.getDefaultBinding().update(function(){
					return  Immutable.List(data);
				});
			}
		});
	},
	render: function() {
		var self = this,
			schoolNodes,
			schoolList,
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
