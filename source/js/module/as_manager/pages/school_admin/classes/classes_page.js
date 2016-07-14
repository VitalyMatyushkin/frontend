const 	React 		= require('react'),
		RouterView 	= require('module/core/router'),
		Morearty	= require('morearty'),
		Route 		= require('module/core/route');

const ClassesPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const 	self 			= this,
				binding 		= self.getDefaultBinding(),
				globalBinding 	= self.getMoreartyContext().getBinding();

		return (
			<RouterView routes={ binding.sub('classesRouting') } binding={globalBinding}>
				<Route path="/school_admin/forms" binding={binding.sub('classesList')} formBinding={binding.sub('classesForm')} component="module/as_manager/pages/school_admin/classes/classes_list"  />
				<Route path="/school_admin/forms/add"  binding={binding.sub('classesAdd')} component="module/as_manager/pages/school_admin/classes/class_add"  />
				<Route path="/school_admin/forms/edit" binding={binding.sub('classesForm')} component="module/as_manager/pages/school_admin/classes/class_edit"  />
			</RouterView>
		)
	}
});


module.exports = ClassesPage;
