const  	ApplicationView 	= require('module/as_www/application'),
		serviceList 		= require('module/core/service_list'),
		userDataInstance 	= require('module/data/user_data'),
		authController 		= require('module/core/auth_controller'),
		ReactDom 			= require('react-dom'),
		React 				= require('react');

function runWwwMode() {
	// Создание контекста Morearty
	const MoreartyContext = Morearty.createContext({
		initialState: {
			userData: userDataInstance.getDefaultState(),
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

	const binding = MoreartyContext.getBinding();

	window.Server = serviceList;

	// Передача связывания контекста в классы данных
	userDataInstance.setBinding(binding.sub('userData'));

	// Включение авторизации сервисов
	serviceList.initialize(binding.sub('userData.authorizationInfo'));

	// Связывания контроллера, отвечающего за контроль за авторизацией с данными
	authController.initialize({
		binding: binding,
		defaultPath: '/'
	});


	// Инициализация приложения
	ReactDom.render(
		React.createElement(MoreartyContext.bootstrap(ApplicationView), null),
		document.getElementById('jsMain')
	);
}

module.exports = runWwwMode;