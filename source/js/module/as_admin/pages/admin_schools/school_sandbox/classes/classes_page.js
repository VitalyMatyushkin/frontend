const	React 					= require('react'),
		Morearty				= require('morearty'),
		RouterView 				= require('module/core/router'),
		Route 					= require('module/core/route'),
		ClassesListComponent 	= require('module/as_admin/pages/admin_schools/school_sandbox/classes/classes_list'),
		ClassAddComponent 		= require('module/as_admin/pages/admin_schools/school_sandbox/classes/class_add'),
		ClassEditComponent 		= require('module/as_admin/pages/admin_schools/school_sandbox/classes/class_edit"');

const ClassesPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const 	self 			= this,
				binding 		= self.getDefaultBinding(),
                subBinding      = binding.sub('classesRouting'),
				globalBinding 	= self.getMoreartyContext().getBinding();

		return (
			<RouterView routes={ subBinding.sub('routing') } binding={globalBinding}>
				<Route path="/school_sandbox/:schoolId/forms" binding={subBinding.sub('forms')} component={ClassesListComponent}  />
				<Route path="/school_sandbox/:schoolId/forms/add"  binding={subBinding} component={ClassAddComponent}  />
				<Route path="/school_sandbox/:schoolId/forms/edit/:formId" binding={subBinding} component={ClassEditComponent}  />
			</RouterView>
		)
	}
});


module.exports = ClassesPage;
