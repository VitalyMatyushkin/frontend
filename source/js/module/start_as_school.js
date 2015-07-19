var ApplicationView = require('module/as_school/application'),
	serviceList = require('module/core/service_list'),
	userDataInstance = require('module/data/user_data'),
	authController = require('module/core/auth_controller'),
	MoreartyContext,
	binding;

function initMainView(schoolId) {
	// Создание контекста Morearty
	MoreartyContext = Morearty.createContext({
		initialState: {
			userData: userDataInstance.getDefaultState(),
			activeSchoolId: schoolId,
			routing: {
				currentPath: '',		// текущий путь
				currentPageName: '',	// имя текущей страницы, если есть
				currentPathParts: [],	// части текущего путии
				pathParameters: [],		// параметры текущего пути (:someParam) в порядке объявления
				parameters: {}			// GET-параметры текущего пути
			}
		},
		options: {
			requestAnimationFrameEnabled: true
		}
	});

	binding = MoreartyContext.getBinding();

	window.Server = serviceList;

	// Передача связывания контекста в классы данных
	userDataInstance.setBinding(binding.sub('userData'));

	// Связывания контроллера, отвечающего за контроль за авторизацией с данными
	authController.initialize({
		binding: binding,
		defaultPath: 'school_admin/summary'
	});

	// Включение авторизации сервисов
	serviceList.initialize(binding.sub('userData.authorizationInfo'));

	// Инициализация приложения
	React.render(
		React.createElement(MoreartyContext.bootstrap(ApplicationView), null),
		document.getElementById('jsMain')
	);
}

function init404View() {
	// Заменить на React
	document.body.innerHTML = '<h1 class="b404">404</h1>';
}

function runMainMode() {
	var schoolId = Helpers.LocalStorage.get('schoolId');

	if (schoolId) {
		initMainView(schoolId);
	} else {
		serviceList.schoolsFindOne.get({
			filter: {
				where: {
					domain: document.location.host.split('.')[0]
				}
			}
		}).then(function(data) {
			var schoolId = data.id;

			Helpers.LocalStorage.set('schoolId', schoolId);
			initMainView(schoolId);
		}, init404View);
	}

}

module.exports = runMainMode;