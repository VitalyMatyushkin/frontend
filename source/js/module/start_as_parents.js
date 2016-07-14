const  	ApplicationView 	= require('module/as_parents/application'),
		userDataInstance 	= require('module/data/user_data'),
		userRulesInstance 	= require('module/data/user_rules'),
		authController 		= require('module/core/auth_controller'),
		serviceList 		= require('module/core/service_list'),
		Morearty			= require('morearty'),
		ReactDom 			= require('react-dom'),
		React 				= require('react');

function runParentMode() {
	const MoreartyContext = Morearty.createContext({
		initialState: {
			userData: userDataInstance.getDefaultState(),
			userRules: userRulesInstance.getDefaultState(),
			routing: {
				currentPath: '',
				currentPageName: '',
				currentPathParts: [],
				pathParameters: [],
				parameters: {}
			},
			schoolProfile: {
				schoolProfileRouting: {}
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
			}
		},
		options: {
			requestAnimationFrameEnabled: true
		}
	});

	const binding = MoreartyContext.getBinding();

	window.Server = serviceList;

	userDataInstance.setBinding(binding.sub('userData'));
	userRulesInstance.setBinding(binding.sub('userRules'));

	serviceList.initialize(binding.sub('userData.authorizationInfo'));

	authController.initialize({
		binding: binding,
		defaultPath: 'events/calendar/all'
	});

	ReactDom.render(
		React.createElement(MoreartyContext.bootstrap(ApplicationView), null),
		document.getElementById('jsMain')
	);
}

module.exports = runParentMode;