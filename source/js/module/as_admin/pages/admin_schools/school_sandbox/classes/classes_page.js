const	React 		= require('react'),
		RouterView 	= require('module/core/router'),
		Route 		= require('module/core/route');

const ClassesPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const 	self 			= this,
				binding 		= self.getDefaultBinding(),
                subBinding      = binding.sub('classesRouting'),
				globalBinding 	= self.getMoreartyContext().getBinding();

		return (
			<RouterView routes={ subBinding.sub('routing') } binding={globalBinding}>
				<Route path="/school_sandbox/:schoolId/forms" binding={subBinding} component="module/as_admin/pages/admin_schools/school_sandbox/classes/classes_list"  />
				<Route path="/school_sandbox/:schoolId/forms/:formId/add"  binding={subBinding} component="module/as_admin/pages/admin_schools/school_sandbox/classes/class_add"  />
				<Route path="/school_sandbox/:schoolId/forms/:formId/edit" binding={subBinding} component="module/as_admin/pages/admin_schools/school_sandbox/classes/class_edit"  />
			</RouterView>
		)
	}
});


module.exports = ClassesPage;
