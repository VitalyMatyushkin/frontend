// @flow

const	ApplicationView 	= require('module/as_manager/application'),
		SimpleAlertFactory	= require('./helpers/simple_alert_factory'),
		ConfirmAlertFactory	= require('./helpers/confirm_alert_factory'),
		SliderAlertFactory	= require('./helpers/slider_alert_factory'),
		userDataInstance 	= require('module/data/user_data'),
		userRulesInstance 	= require('module/data/user_rules'),
		authController 		= require('module/core/auth_controller'),
		serviceList 		= require('module/core/service_list'),
		initTawkTo			= require('module/tawk_to/tawk_to'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),
		ReactDom 			= require('react-dom'),
		React 				= require('react');

function runManagerMode() {
	const today = new Date();

	const MoreartyContext = Morearty.createContext({
		initialState: {
			userData:	userDataInstance.getDefaultState(),
			userRules:	userRulesInstance.getDefaultState(),
			notificationAlertData: {
				isOpen:					false,

				text:					'',

				okButtonText:			'',

				handleClickOkButton:	undefined
			},
			sliderHelpAlert: {
				isOpen:						false,
				
				webIntroEnabled:			true
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
					todayDate: 			today,
					monthDate:			new Date(today.getFullYear(), today.getMonth()),
					selectedDate:		new Date(today.getFullYear(), today.getMonth(), today.getDate()),
					eventsData: {},
					selectedDateEventsData: {
						isSync:	false,
						events:	[]
					}
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
			},
			form: {}
		},
		options: {
			requestAnimationFrameEnabled: true
		}
	});

	const binding = MoreartyContext.getBinding();

	window.Server = serviceList;
	// initializing all services (open too) only when we got all vars set in window.
	// this is not too very brilliant idea, but there is no other way to fix it quick
	serviceList.initializeOpenServices();
	serviceList.initialize(
		binding.sub('userData')
	);

	userDataInstance.checkAndGetValidSessions()
		.then(sessions => {
			binding.set('userData', Immutable.fromJS(sessions));

			userDataInstance.setBinding(binding.sub('userData'));
			userRulesInstance.setBinding(binding.sub('userRules'));

			window.simpleAlert = SimpleAlertFactory.create(binding.sub('notificationAlertData'));
			window.confirmAlert = ConfirmAlertFactory.create(binding.sub('confirmAlertData'));
			window.sliderAlert = SliderAlertFactory.create(binding.sub('sliderHelpAlert'));
			
			authController
				.initialize({binding: binding})
				.then(() => {
					ReactDom.render(
						React.createElement(MoreartyContext.bootstrap(ApplicationView), null),
						document.getElementById('jsMain')
					);

					authController.redirectUserByUserAuthData();

					initTawkTo();
				});
		});
}

module.exports = runManagerMode;