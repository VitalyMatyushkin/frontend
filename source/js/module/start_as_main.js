var ApplicationView = require('module/as_main/application'),
	serviceList = require('module/core/service_list'),
	MoreartyContext,
	binding;

function runMainMode() {
// Создание контекста Morearty
	MoreartyContext = Morearty.createContext({
		initialState: {
			activeSchoolId: '0f338934-0b0d-4336-ac63-34847789f8db',
			routing: {
				currentPath: '',		// текущий путь
				currentPageName: '',	// имя текущей страницы, если есть
				currentPathParts: [],	// части текущего путии
				pathParameters: [],		// параметры текущего пути (:someParam) в порядке объявления
				parameters: {}			// GET-параметры текущего пути
			},
			schoolProfile: {
				schoolProfileRouting: {}
			}
		},
		options: {
			requestAnimationFrameEnabled: true
		}
	});

	binding = MoreartyContext.getBinding();

	window.Server = serviceList;

	// Включение авторизации сервисов
	serviceList.initialize(binding.sub('userData.authorizationInfo'));

	// Инициализация приложения
	React.render(
		React.createElement(MoreartyContext.bootstrap(ApplicationView), null),
		document.getElementById('jsMain')
	);
}

module.exports = runMainMode;