/**
 * Created by Woland on 04.08.2017.
 */
// @flow
const React  = require('react');
const Morearty = require('morearty');
const Immutable = require('immutable');
const ReactDom = require('react-dom');

const {ServiceList} = require("module/core/service_list/service_list");

const ApplicationView = require('module/as_invite/application');

const {SimpleAlertFactory} = require('./helpers/simple_alert_factory');
const {ConfirmAlertFactory} = require('./helpers/confirm_alert_factory');

const userDataInstance = require('module/data/user_data');
const userRulesInstance = require('module/data/user_rules');

const initTawkTo = require('module/tawk_to/tawk_to');


function runInviteMode() {
	const today = new Date();

// Create Morearty context
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

	window.Server = new ServiceList(binding.sub('userData'));

	userDataInstance.checkAndGetValidSessions()
		.then(sessions => {
			binding.set('userData', Immutable.fromJS(sessions));

			userDataInstance.setBinding(binding.sub('userData'));
			userRulesInstance.setBinding(binding.sub('userRules'));

			window.simpleAlert = SimpleAlertFactory.create(binding.sub('notificationAlertData'));
			window.confirmAlert = ConfirmAlertFactory.create(binding.sub('confirmAlertData'));

			ReactDom.render(
				React.createElement(MoreartyContext.bootstrap(ApplicationView), null),
				document.getElementById('jsMain')
			);

			initTawkTo();
		});
}

module.exports = runInviteMode;
