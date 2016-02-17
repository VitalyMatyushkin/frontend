const 	RouterView 	= require('module/core/router'),
		React 		= require('react'),
		Route 		= require('module/core/route'),

SchoolsPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
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
