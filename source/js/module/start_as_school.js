const	SchoolApplicationView		= require('./as_school/application'),
		SchoolUnionApplicationView	= require('./as_school_union/application'),
		{SimpleAlertFactory}		= require('./helpers/simple_alert_factory'),
		{ConfirmAlertFactory}		= require('./helpers/confirm_alert_factory'),
		{OpenServiceList}			= require('module/core/service_list/open_service_list'),
		{ServiceList}				= require("module/core/service_list/service_list"),
		userDataInstance			= require('module/data/user_data'),
		cookiePopupData			= require('module/data/cookie_popup_data'),
		{authController}			= require('module/core/auth_controller'),
		Immutable					= require('immutable'),
		ReactDom 					= require('react-dom'),
		React 						= require('react'),
		Morearty					= require('morearty');

function initMainSchoolView(school) {
	const today = new Date();

	// creating morearty context
	const MoreartyContext = Morearty.createContext({
		initialState: {
			userData: 			userDataInstance.getDefaultState(),
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
			activeSchoolId: 	school.id,
			activeSchool:		Immutable.fromJS(school),
			routing: {
				currentPath: '',		// текущий путь
				currentPageName: '',	// имя текущей страницы, если есть
				currentPathParts: [],	// части текущего путии
				pathParameters: [],		// параметры текущего пути (:someParam) в порядке объявления
				parameters: {}			// GET-параметры текущего пути
			},
			loginPublicSchool: {
				hashOfRedirectPageAfterLogin: 'home'
			},
			schoolHomePage: {					// wrapping to 'schoolHomePage' not to break router. I'm not sure we actually need that, but this is easiest way
				isPasswordPopupOpen:		false,
				/** by default we showing popup with cookie policy on each visit
				 * because we don't store this value anywhere in user's browser*/
				isCookiePopupDisplaying:	cookiePopupData.getDefaultState(),
				events: {							// will keep all data related to showing events on main page here
					todayDate: 			today,
					monthDate:			new Date(today.getFullYear(), today.getMonth()),
					selectedDate:		new Date(today.getFullYear(), today.getMonth(), today.getDate()),
					distinctEventDatesData: {
						isSync:	false,
						dates:	[]
					},
					selectedDateEventsData: {
						isSync:	false,
						events:	[]
					},
					nextSevenDaysEvents: {
						isSync:	false,
						events:	[]
					},
					prevSevenDaysFinishedEvents: {
						isSync:	false,
						events:	[]
					}
				}
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

			// setting context binding to data classes
			userDataInstance.setBinding(binding.sub('userData'));
			cookiePopupData.setBinding(binding.sub('schoolHomePage'));

			authController.initialize({
					binding:		binding,
					asPublicSchool:	true
				})
				.then(() => {
					window.simpleAlert = SimpleAlertFactory.create(binding.sub('notificationAlertData'));
					window.confirmAlert = ConfirmAlertFactory.create(binding.sub('confirmAlertData'));

					ReactDom.render(
						React.createElement(MoreartyContext.bootstrap(SchoolApplicationView), null),
						document.getElementById('jsMain')
					);

					authController.redirectUserByUserAuthData();
				});
		});
}

function initMainSchoolUnionView(school) {
	const today = new Date();

	// creating morearty context
	const MoreartyContext = Morearty.createContext({
		initialState: {
			userData: 			userDataInstance.getDefaultState(),
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
			activeSchoolId: 	school.id,
			activeSchool:		Immutable.fromJS(school),
			routing: {
				currentPath: '',		// текущий путь
				currentPageName: '',	// имя текущей страницы, если есть
				currentPathParts: [],	// части текущего путии
				pathParameters: [],		// параметры текущего пути (:someParam) в порядке объявления
				parameters: {}			// GET-параметры текущего пути
			},
			loginPublicSchool: {
				hashOfRedirectPageAfterLogin: 'home'
			},
			schoolHomePage: {					// wrapping to 'schoolHomePage' not to break router. I'm not sure we actually need that, but this is easiest way
				isPasswordPopupOpen:		false,
				/** by default we showing popup with cookie policy on each visit
				 * because we don't store this value anywhere in user's browser*/
				isCookiePopupDisplaying:	cookiePopupData.getDefaultState(),
				events: {							// will keep all data related to showing events on main page here
					todayDate: 			today,
					monthDate:			new Date(today.getFullYear(), today.getMonth()),
					selectedDate:		new Date(today.getFullYear(), today.getMonth(), today.getDate()),
					distinctEventDatesData: {
						isSync:	false,
						dates:	[]
					},
					selectedDateEventsData: {
						isSync:	false,
						events:	[]
					},
					nextSevenDaysEvents: {
						isSync:	false,
						events:	[]
					},
					prevSevenDaysFinishedEvents: {
						isSync:	false,
						events:	[]
					}
				}
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

			// setting context binding to data classes
			userDataInstance.setBinding(binding.sub('userData'));
			cookiePopupData.setBinding(binding.sub('schoolHomePage'));

			authController.initialize({
					binding:		binding,
					asPublicSchool:	true
				}).then(() => {
					window.simpleAlert = SimpleAlertFactory.create(binding.sub('notificationAlertData'));
					window.confirmAlert = ConfirmAlertFactory.create(binding.sub('confirmAlertData'));

					ReactDom.render(
						React.createElement(MoreartyContext.bootstrap(SchoolUnionApplicationView), null),
						document.getElementById('jsMain')
					);

					authController.redirectUserByUserAuthData();
				});
		});
}

function init404View() {
	// change to React
	document.body.innerHTML = '<h1 class="b404">404</h1>';
}

function runMainMode() {
	const openServiceList = new OpenServiceList();

	const schoolDomain = document.location.host.split('.')[0];

	const filter = {
		where: {
			domain: schoolDomain,
			kind: {
				$in: ['School', 'SchoolUnion']
			}
		}
	};

	return openServiceList.publicSchools.get({filter: filter}).then( schoolList => {
		const optSchool = schoolList[0];
		switch (true) {
			case typeof optSchool === "undefined":
				init404View();
				break;
			case optSchool.kind === "School":
				initMainSchoolView(optSchool);
				break;
			case optSchool.kind === "SchoolUnion":
				initMainSchoolUnionView(optSchool);
				break;
		}
	});
}

module.exports = runMainMode;