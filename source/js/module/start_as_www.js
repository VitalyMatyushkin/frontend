const  	ApplicationView 	= require('module/as_www/application'),
		serviceList 		= require('module/core/service_list'),
		userDataInstance 	= require('module/data/user_data'),
		authController 		= require('module/core/auth_controller'),
		initTawkTo			= require('module/tawk_to/tawk_to'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),
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
	// initializing all services (open too) only when we got all vars set in window.
	// this is not too very brilliant idea, but there is no other way to fix it quick
	// TODO: fix me
	serviceList.initializeOpenServices();
	// Включение авторизации сервисов
	serviceList.initialize(
		binding.sub('userData')
	);

	userDataInstance.checkAndGetValidSessions()
		.then(sessions => {
			binding.set('userData', Immutable.fromJS(sessions));

			authController
				.initialize({binding: binding})
				.then(() => {
					ReactDom.render(
						React.createElement(MoreartyContext.bootstrap(ApplicationView), null),
						document.getElementById('jsMain')
					);

					initTawkTo();
				});
		});
}

module.exports = runWwwMode;