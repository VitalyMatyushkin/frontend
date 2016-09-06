const 	ApplicationView 	= require('module/as_school/application'),
		serviceList 		= require('module/core/service_list'),
		userDataInstance 	= require('module/data/user_data'),
		authController 		= require('module/core/auth_controller'),
		ReactDom 			= require('react-dom'),
		React 				= require('react'),
		Morearty			= require('morearty'),
		Helpers				= require('module/helpers/storage');

function initMainView(schoolId) {
	// creating morearty context
	const MoreartyContext = Morearty.createContext({
		initialState: {
			userData: 			userDataInstance.getDefaultState(),
			activeSchoolId: 	schoolId,
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

	// setting context binding to data classes
	userDataInstance.setBinding(binding.sub('userData'));
	// Связывания контроллера, отвечающего за контроль за авторизацией с данными
	authController.initialize({
		binding: binding,
		defaultPath: 'home',
        asSchool:true //Flag for public school page
	});

	// initializing all services (open too) only when we got all vars set in window.
	// this is not too very brilliant idea, but there is no other way to fix it quick
	// TODO: fix me
	serviceList.initializeOpenServices();

	// Turning on authorization service
	serviceList.initialize(binding.sub('userData.authorizationInfo'));

	ReactDom.render(
		React.createElement(MoreartyContext.bootstrap(ApplicationView), null),
		document.getElementById('jsMain')
	);
}

function init404View() {
	// change to React
	document.body.innerHTML = '<h1 class="b404">404</h1>';
}

function runMainMode() {
	serviceList.initializeOpenServices();

	const schoolDomain = document.location.host.split('.')[0];

	const filter = {
		where: {
			domain: schoolDomain
		}
	};

	return serviceList.publicSchools.get({filter: filter}).then( schoolList => {
		const optSchool = schoolList[0];
		if(optSchool) {
			initMainView(optSchool.id);
		} else {
			init404View();
		}
	});

}

module.exports = runMainMode;