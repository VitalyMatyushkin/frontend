const  	ApplicationView 	= require('module/as_parents/application'),
		SimpleAlertFactory	= require('./helpers/simple_alert_factory'),
		ConfirmAlertFactory	= require('./helpers/confirm_alert_factory'),
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
			notificationAlertData: {
				isOpen:					false,

				text:					'',

				okButtonText:			'',

				handleClickOkButton:	undefined
			},
			confirmAlertData: {
				isOpen:						false,

				text:						'',

				okButtonText:				'',
				cancelButtonText:			'',

				handleClickOkButton:		undefined,
				handleClickCancelButton:	undefined
			},
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

	// initializing all services (open too) only when we got all vars set in window.
	// this is not too very brilliant idea, but there is no other way to fix it quick
	// TODO: fix me
	serviceList.initializeOpenServices();

	serviceList.initialize(binding.sub('userData.authorizationInfo'));

	authController.initialize({
		binding: binding,
		defaultPath: 'events/calendar/all'
	});

	window.simpleAlert = SimpleAlertFactory.create(binding.sub('notificationAlertData'));
	window.confirmAlert = ConfirmAlertFactory.create(binding.sub('confirmAlertData'));

	ReactDom.render(
		React.createElement(MoreartyContext.bootstrap(ApplicationView), null),
		document.getElementById('jsMain')
	);
}

module.exports = runParentMode;