var SchoolsPage,
	RouterView = require('module/core/router'),
	Route = require('module/core/route');

SchoolsPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		var self = this,
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('userRules.activeSchoolId');

		if (!activeSchoolId) {
			self._updateSchoolList().then(function(schoolsList) {

				// Если есть хотя бы одна школа, делаем первую школой "по умолчанию"
				if (schoolsList[0]) {
					globalBinding.set('userRules.activeSchoolId', schoolsList[0].id);
					document.location.hash = 'school_admin/summary';
				} else {
					// В противном случае перенаправляем пользователя на страницу добавления школы
					document.location.hash = 'schools/add';
				}
			});
		};
	},
	/**
	 * Обновление списка школ пользователя
	 * @returns PromiseClass
	 * @private
	 */
	_updateSchoolList: function() {
		var self = this,
			globalBinding = self.getMoreartyContext().getBinding(),
			userId = globalBinding.get('userData.authorizationInfo.userId');

		// Получение и сохранение списка школ
		return Server.schools.get().then(function(data) {
			self.getDefaultBinding().set('schoolsList', Immutable.fromJS(data));
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding();

		return (
			<RouterView routes={ binding.sub('schoolsRouting') } binding={globalBinding}>
				<Route path="/schools/edit" binding={ binding.sub('schoolsForm')} component="module/as_manager/pages/schools/schools_edit"  />
				<Route path="/schools/add" binding={ binding.sub('schoolsList')} component="module/as_manager/pages/schools/schools_add"  />
				<Route path="/schools" binding={ binding.sub('schoolsList')} component="module/as_manager/pages/schools/schools_list" />
			</RouterView>
		)
	}
});


module.exports = SchoolsPage;
