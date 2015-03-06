var SchoolListPage = require('module/pages/schools/list'),
	SchoolAddPage = require('module/pages/schools/add'),
	SchoolsPage;

SchoolsPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		var self = this,
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('userRules.activeSchoolId');

		// Если есть идентефикатор активной школы
		if (activeSchoolId) {
			self._redirectToSchoolId(activeSchoolId);
		} else {

			self._updateSchoolList().then(function(schoolsList) {

				// Если есть хотя бы одна школа, делаем первую школой "по умолчанию"
				if (schoolsList[0]) {
					globalBinding.set('userRules.activeSchoolId', schoolsList[0].id);
					self._redirectToSchoolId(schoolsList[0].id);
				} else {
					// В противном случае перенаправляем пользователя на страницу добавления школы
					self._redirectToAddSchool();
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
		return Server.ownerSchools.get(userId).then(function(data) {
			self.getDefaultBinding().set('list', Immutable.fromJS(data));
		});
	},
	/**
	 * Метод перенаправляет пользователя на страницу заданной школы
	 * @returns {boolean}
	 * @private
	 */
	_redirectToSchoolId: function(schoolId) {
		var self = this;

		document.location.hash = 'schools/view?id=' + schoolId;
	},
	/**
	 * Метод перенапраялет пользователя на страницу добавления школы
	 * @private
	 */
	_redirectToAddSchool: function() {
		var self = this;

		document.location.hash = 'schools/add';
	},
	/**
	 * Метод перенапраялет пользователя на список школ
	 * @private
	 */
	_redirectToSchoolList: function() {
		var self = this;

		document.location.hash = 'schools/list';
	},
	render: function() {
		return (
			null
		)
	}
});


module.exports = SchoolsPage;
