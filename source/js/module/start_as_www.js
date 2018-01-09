const	ApplicationView		= require('module/as_www/application'),
		{ServiceList}		= require("module/core/service_list/service_list"),
		userDataInstance	= require('module/data/user_data'),
		{authController}	= require('module/core/auth_controller'),
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

	window.Server = new ServiceList(binding.sub('userData'));

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