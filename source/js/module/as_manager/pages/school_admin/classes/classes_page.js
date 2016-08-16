const 	React 					= require('react'),
		RouterView 				= require('module/core/router'),
		Morearty				= require('morearty'),
		Route 					= require('module/core/route'),
		ClassesListComponent 	= require("module/as_manager/pages/school_admin/classes/list/class-list"),
		ClassAddComponent 		= require("module/as_manager/pages/school_admin/classes/class_add"),
		ClassEditComponent 		= require("module/as_manager/pages/school_admin/classes/class_edit");

const ClassesPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const 	self 			= this,
				binding 		= self.getDefaultBinding(),
				globalBinding 	= self.getMoreartyContext().getBinding();

		return (
			<RouterView routes={ binding.sub('classesRouting') } binding={globalBinding}>
				<Route path="/school_admin/forms" binding={binding.sub('classesList')} formBinding={binding.sub('classesForm')} component={ClassesListComponent} />
				<Route path="/school_admin/forms/add"  binding={binding.sub('classesAdd')} component={ClassAddComponent} />
				<Route path="/school_admin/forms/edit" binding={binding.sub('classesForm')} component={ClassEditComponent} />
			</RouterView>
		)
	}
});


module.exports = ClassesPage;
