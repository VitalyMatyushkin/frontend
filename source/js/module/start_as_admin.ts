import * as React from 'react';
import * as ReactDom  from 'react-dom';
import * as Morearty from 'morearty';
import * as Immutable from 'immutable';

import * as ApplicationView from 'module/as_admin/application';
import {SimpleAlertFactory} from './helpers/simple_alert_factory';
import {ConfirmAlertFactory} from './helpers/confirm_alert_factory';

import {UserDataInstance} from 'module/data/user_data';
import {UserRulesInstance} from 'module/data/user_rules';
import {authController} from 'module/core/auth_controller';
import {AdminServiceList} from 'module/core/service_list/admin_service_list';

import * as initTawkTo from 'module/tawk_to/tawk_to';

export function asAdmin() {
// Creating Morearty context
	const MoreartyContext = Morearty.createContext({
		initialState: {
			userData: UserDataInstance.getDefaultState(),
			userRules: UserRulesInstance.getDefaultState(),
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
				currentPath: '',		// текущий путь
				currentPageName: '',	// имя текущей страницы, если есть
				currentPathParts: [],	// части текущего путии
				pathParameters: [],		// параметры текущего пути (:someParam) в порядке объявления
				parameters: {}			// GET-параметры текущего пути
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

	window.Server = new AdminServiceList(binding.sub('userData'));

	UserDataInstance.checkAndGetValidSessions()
		.then(sessions => {
			binding.set('userData', Immutable.fromJS(sessions));

			UserDataInstance.setBinding(binding.sub('userData'));
			UserRulesInstance.setBinding(binding.sub('userRules'));

			authController
				.initialize({
					binding: binding
				}).then(() => {
					window.simpleAlert = SimpleAlertFactory.create(binding.sub('notificationAlertData'));
					window.confirmAlert = ConfirmAlertFactory.create(binding.sub('confirmAlertData'));

					ReactDom.render(
						React.createElement(MoreartyContext.bootstrap(ApplicationView), null),
						document.getElementById('jsMain')
					);

					authController.redirectUserByUserAuthData();

					initTawkTo();
				});
		});
}