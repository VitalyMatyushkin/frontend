var ApplicationView = require('module/as_main/application'),
	serviceList = require('module/core/service_list'),
	MoreartyContext,
	binding;

function runMainMode() {
// Создание контекста Morearty
	MoreartyContext = Morearty.createContext({
		initialState: {
			activeSchoolId: '233ef31a-26b7-4c80-87f0-7310ae533579',
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

	// Включение авторизации сервисов
	serviceList.initialize(binding.sub('userData.authorizationInfo'));

	// Инициализация приложения
	React.render(
		React.createElement(MoreartyContext.bootstrap(ApplicationView), null),
		document.getElementById('jsMain')
	);
}

module.exports = runMainMode;