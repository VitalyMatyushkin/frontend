var SchoolsPage,
	RouterView = require('module/core/router'),
	Route = require('module/core/route');

SchoolsPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		var self = this,
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('userRules.activeSchoolId');

		if (!activeSchoolId) {
			self._updateSchoolList().then(function(schoolsList) {

				// If there is at least any school making first of them default
				if (schoolsList[0]) {
					globalBinding.set('userRules.activeSchoolId', schoolsList[0].id);
					document.location.hash = 'school_admin/summary';
				} else {
                    //Else direct unverified user to the waiting area
                    document.location.hash = 'schools/lounge';
				}
			});
        }
    },
	/**
	 * Updating user's school list
	 * @returns Promise
	 * @private
	 */
	_updateSchoolList: function() {
		var self = this,
			globalBinding = self.getMoreartyContext().getBinding(),
			userId = globalBinding.get('userData.authorizationInfo.userId');

		// Getting and saving school list
		return Server.schools.get().then(function(data) {
			self.getDefaultBinding().set('schoolsList', Immutable.fromJS(data));
			return;
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding();

		return (
			<RouterView routes={ binding.sub('schoolsRouting') } binding={globalBinding}>
				<Route path="/schools/edit" binding={ binding.sub('schoolsForm')} component="module/as_manager/pages/schools/schools_edit"  />
				<Route path="/schools/add" binding={ binding.sub('schoolsList')} component="module/as_manager/pages/schools/schools_add"  />
				<Route path="/schools" binding={ binding.sub('schoolsList')} component="module/as_manager/pages/schools/schools_list" />
                <Route path="/schools/lounge" binding={ binding.sub('schoolsList')} component="module/as_manager/pages/schools/schools_lounge" />
			</RouterView>
		)
	}
});


module.exports = SchoolsPage;
