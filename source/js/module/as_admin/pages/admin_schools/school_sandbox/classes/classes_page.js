const	React 					= require('react'),
		Morearty				= require('morearty'),
		RouterView 				= require('module/core/router'),
		Route 					= require('module/core/route'),
		ClassesListComponent 	= require('module/as_admin/pages/admin_schools/school_sandbox/classes/classes-list'),
		ClassAddComponent 		= require('module/as_admin/pages/admin_schools/school_sandbox/classes/class_add'),
		ClassEditComponent 		= require('module/as_admin/pages/admin_schools/school_sandbox/classes/class_edit'),
		SVG						= require('module/ui/svg');

const ClassesPage = React.createClass({
	mixins: [Morearty.Mixin],
	createNewClass: function(){
		document.location.hash = document.location.hash +'/add';
	},
	render: function() {
		const 	binding 		= this.getDefaultBinding(),
				subBinding 		= binding.sub('classesRouting'),
				globalBinding 	= this.getMoreartyContext().getBinding(),
				addButton 		= <div className="addButtonShort" onClick={this.createNewClass}><SVG icon="icon_add_form" /></div>;


		return (
			<RouterView routes={ subBinding.sub('routing') } binding={globalBinding}>
				<Route path="/school_sandbox/:schoolId/forms" binding={subBinding.sub('forms')} component={ClassesListComponent} addButton={addButton} />
				<Route path="/school_sandbox/:schoolId/forms/add"  binding={subBinding} component={ClassAddComponent}  />
				<Route path="/school_sandbox/:schoolId/forms/edit/:formId" binding={subBinding} component={ClassEditComponent}  />
			</RouterView>
		)
	}
});


module.exports = ClassesPage;
