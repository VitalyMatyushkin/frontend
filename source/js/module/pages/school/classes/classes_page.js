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
				<Route path="/school/forms" binding={binding.sub('classesList')} formBinding={binding.sub('classesForm')} component="module/pages/school/classes/classes_list"  />
				<Route path="/school/forms/add"  binding={binding.sub('classesAdd')} component="module/pages/school/classes/class_add"  />
				<Route path="/school/forms/edit" binding={binding.sub('classesForm')} component="module/pages/school/classes/class_edit"  />
			</RouterView>
		)
	}
});


module.exports = ClassesPage;
