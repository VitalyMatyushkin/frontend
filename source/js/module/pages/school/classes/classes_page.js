var ClassesPage,
	RouterView = require('module/core/router'),
	Route = require('module/core/route');

ClassesPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding();

		return (
			<RouterView routes={ binding.sub('classesRouting') } binding={globalBinding}>
				<Route path="/school/classes" binding={binding.sub('classesList')} formBinding={binding.sub('classesForm')} component="module/pages/school/classes/classes_list"  />
				<Route path="/school/classes/add"  binding={binding.sub('classesAdd')} component="module/pages/school/classes/class_add"  />
				<Route path="/school/classes/edit" binding={binding.sub('classesForm')} component="module/pages/school/classes/class_edit"  />
			</RouterView>
		)
	}
});


module.exports = ClassesPage;
