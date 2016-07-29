const 	RouterView 				= require('module/core/router'),
		React 					= require('react'),
		Morearty				= require('morearty'),
		Route 					= require('module/core/route'),
		SchoolsEditComponent 	= require("module/as_manager/pages/schools/schools_edit"),
		SchoolsAddComponent 	= require("module/as_manager/pages/schools/schools_add"),
		SchoolsListComponent 	= require("module/as_manager/pages/schools/schools_list"),
		SchoolsLoungeComponent 	= require("module/as_manager/pages/schools/schools_lounge");


const SchoolsPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
    },
	render: function() {
		const self        = this,
			binding       = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding();

		return (
			<RouterView routes={ binding.sub('schoolsRouting') } binding={globalBinding}>
				<Route path="/schools/edit"
					   binding={ binding.sub('schoolsForm')}
					   component={SchoolsEditComponent}/>

				<Route path="/schools/add"
					   binding={ binding.sub('schoolsList')}
					   component={SchoolsAddComponent}/>

				<Route path="/schools"
					   binding={ binding.sub('schoolsList')}
					   component={SchoolsListComponent}/>

				<Route path="/schools/lounge"
					   binding={ binding.sub('schoolsList')}
					   component={SchoolsLoungeComponent}/>
			</RouterView>
		)
	}
});


module.exports = SchoolsPage;
