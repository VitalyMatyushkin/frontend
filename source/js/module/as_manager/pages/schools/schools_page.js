const 	RouterView 	= require('module/core/router'),
		React 		= require('react'),
		Route 		= require('module/core/route'),
		Immutable 	= require('immutable');

const SchoolsPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
        //const self = this,
			//globalBinding = self.getMoreartyContext().getBinding(),
			//activeSchoolId = globalBinding.get('userRules.activeSchoolId');
        //
        //self._updateSchoolList().then(function(schoolsList) {
        //    if(!schoolsList || schoolsList && schoolsList.length === 0)
        //        document.location.hash = 'schools/lounge';
        //    // If there is at least any school making first of them default
        //    else if (schoolsList.length === 1) {
        //        globalBinding.set('userRules.activeSchoolId', schoolsList[0].id);
        //        document.location.hash = 'school_admin/summary';
        //    }
        //});
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
		return window.Server.schools.get().then(function(data) {
			self.getDefaultBinding().set('schoolsList', Immutable.fromJS(data));
			return data;
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
