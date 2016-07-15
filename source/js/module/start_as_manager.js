const 	ApplicationView 	= require('module/as_manager/application'),
		userDataInstance 	= require('module/data/user_data'),
		userRulesInstance 	= require('module/data/user_rules'),
		authController 		= require('module/core/auth_controller'),
		serviceList 		= require('module/core/service_list'),
		Morearty			= require('morearty'),
		ReactDom 			= require('react-dom'),
		React 				= require('react');

function runManagerMode() {

// Create Morearty context
	const MoreartyContext = Morearty.createContext({
		initialState: {
			userData: userDataInstance.getDefaultState(),
			userRules: userRulesInstance.getDefaultState(),
			routing: {
				currentPath: '',
				currentPageName: '',	// current page name, if exist
				currentPathParts: [],
				pathParameters: [],
				parameters: {}			// GET-params of current path
			},
			schoolProfile: {
				schoolProfileRouting: {}
			},
			activeSchool: {
				classes: {
					studentsList: [],
					studentsRouting: {},
					studentForm: {}
				},
				houses: {
					studentsList: [],
					studentsRouting: {},
					studentForm: {}
				},
				students: {
					studentsList: [],
					studentsRouting: {},
					studentForm: {}
				},
				summary: {},
				schoolRouting: {}
			},
			schoolsPage: {
				schoolsList: [],
				schoolsRouting: {},
				schoolsForm: {}
			},
			events: {
				sync: false,
				models: [],
				calendar: {
					currentDate: new Date(),
					mode: 'month'
				}
			},
			event: {
				eventRouting: {}
			},
			teams: {
				sync: false,
				models: []
			},
			invites: {
				sync: false,
				models: []
			},
			sports: {
				sync: false,
				models: []
			},
			albums: {
				sync: false
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
	userRulesInstance.setBinding(binding.sub('userRules'));

	// initializing all services (open too) only when we got all vars set in window.
	// this is not too very brilliant idea, but there is no other way to fix it quick
	// TODO: fix me
	serviceList.initializeOpenServices();
	// Enable servises
	serviceList.initialize(binding.sub('userData.authorizationInfo'));

	// Связывания контроллера, отвечающего за контроль за авторизацией с данными
	authController.initialize(
		{
			binding: binding,
			defaultPath: 'school_admin/summary'
		}
	);


	// Инициализация приложения
	ReactDom.render(
		React.createElement(MoreartyContext.bootstrap(ApplicationView), null),
		document.getElementById('jsMain')
	);


}

module.exports = runManagerMode;
