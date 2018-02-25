import * as React from 'react';
import * as ReactDom from 'react-dom';
import * as Morearty from 'morearty';
import * as Immutable from 'immutable';

import {authController} from 'module/core/auth_controller';
import {ServiceList} from 'module/core/service_list/service_list';

import * as ApplicationView from 'module/as_manager/application';
import {SimpleAlertFactory} from 'module/helpers/simple_alert_factory';
import {ConfirmAlertFactory} from 'module/helpers/confirm_alert_factory';
import {SliderAlertFactory} from 'module/helpers/slider_alert_factory';
import {UserDataInstance} from 'module/data/user_data';
import {UserRulesInstance} from 'module/data/user_rules';

import * as initTawkTo  from 'module/tawk_to/tawk_to';

export function asApp() {
	const today = new Date();

	const MoreartyContext = Morearty.createContext({
		initialState: {
			userData:	UserDataInstance.getDefaultState(),
			userRules:	UserRulesInstance.getDefaultState(),
			notificationAlertData: {
				isOpen:					false,

				text:					'',

				okButtonText:			'',

				handleClickOkButton:	undefined
			},
			sliderHelpAlert: {
				isOpen:						false,
				
				wasOpened:					false,
				
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

	window.Server = new ServiceList(binding.sub('userData'));

	UserDataInstance.checkAndGetValidSessions()
		.then(sessions => {
			binding.set('userData', Immutable.fromJS(sessions));

			UserDataInstance.setBinding(binding.sub('userData'));
			UserRulesInstance.setBinding(binding.sub('userRules'));

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