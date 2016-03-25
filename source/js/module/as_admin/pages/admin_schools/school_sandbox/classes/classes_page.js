const	React 		= require('react'),
		RouterView 	= require('module/core/router'),
		Route 		= require('module/core/route');

const ClassesPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const 	self 			= this,
				binding 		= self.getDefaultBinding(),
				globalBinding 	= self.getMoreartyContext().getBinding();

		return (
			<RouterView routes={ binding.sub('classesRouting') } binding={globalBinding}>
				<Route path="/school_sandbox/forms" binding={binding.sub('classesList')} formBinding={binding.sub('classesForm')} component="module/as_admin/pages/admin_schools/classes/classes_list"  />
				<Route path="/school_sandbox/forms/add"  binding={binding.sub('classesAdd')} component="module/as_admin/pages/admin_schools/school_sandbox/classes/class_add"  />
				<Route path="/school_sandbox/forms/edit" binding={binding.sub('classesForm')} component="module/as_admin/pages/admin_schools/school_sandbox/classes/class_edit"  />
			</RouterView>
		)
	}
});


module.exports = ClassesPage;
