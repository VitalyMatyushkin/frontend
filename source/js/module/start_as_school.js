const 	ApplicationView 	= require('module/as_school/application'),
		serviceList 		= require('module/core/service_list'),
		userDataInstance 	= require('module/data/user_data'),
		authController 		= require('module/core/auth_controller'),
		ReactDom 			= require('reactDom'),
		React 				= require('react'),
		Helpers				= require('module/helpers/storage');

function initMainView(schoolId) {
	// creating morearty context
	const MoreartyContext = Morearty.createContext({
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

	// Turning on authorization service
	serviceList.initialize(binding.sub('userData.authorizationInfo'));

	// Dirty dirty hack, login as superuser.
	window.Server.login.post({username:"superadmin",password:"superadmin"}).then(function(data) {
		binding.update('userData.authorizationInfo', function(){
			return Immutable.fromJS({
				id: data.id,
				ttl: data.ttl,
				userId: data.userId,
				verified: data.user.verified,
				registerType: data.user.registerType
			});
		});

		ReactDom.render(
			React.createElement(MoreartyContext.bootstrap(ApplicationView), null),
			document.getElementById('jsMain')
		);
	});
}

function init404View() {
	// change to React
	document.body.innerHTML = '<h1 class="b404">404</h1>';
}

function runMainMode() {
	var schoolId = Helpers.LocalStorage.get('schoolId');
	schoolId = 'undefined'; //set this to undefined string so we can perform a fresh call for school details - avoids cache problems
	if (schoolId !== 'undefined') {
		initMainView(schoolId);
	} else {
		serviceList.schoolsFindOne.get({
			filter: {
				where: {
					domain: document.location.host.split('.')[0]
				}
			}
		}).then(function(data) {
			var schoolId = data[0].id;
			Helpers.LocalStorage.set('schoolId', schoolId);
			initMainView(schoolId);
		}, init404View);
	}

}

module.exports = runMainMode;