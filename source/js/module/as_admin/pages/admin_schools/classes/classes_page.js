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
				<Route path="/admin_schools/admin_views/forms" binding={binding.sub('classesList')} formBinding={binding.sub('classesForm')} component="module/as_admin/pages/admin_schools/classes/classes_list"  />
				<Route path="/admin_schools/admin_views/forms/add"  binding={binding.sub('classesAdd')} component="module/as_admin/pages/admin_schools/classes/class_add"  />
				<Route path="/admin_schools/admin_views/forms/edit" binding={binding.sub('classesForm')} component="module/as_admin/pages/admin_schools/classes/class_edit"  />
			</RouterView>
		)
	}
});


module.exports = ClassesPage;
