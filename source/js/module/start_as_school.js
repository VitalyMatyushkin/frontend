const	SchoolApplicationView		= require('./as_school/application'),
		SchoolUnionApplicationView	= require('./as_school_union/application'),
		SimpleAlertFactory			= require('./helpers/simple_alert_factory'),
		ConfirmAlertFactory			= require('./helpers/confirm_alert_factory'),
		serviceList 				= require('module/core/service_list'),
		userDataInstance 			= require('module/data/user_data'),
		cookiePopupData 			= require('module/data/cookie_popup_data'),
		authController 				= require('module/core/auth_controller'),
		initTawkTo					= require('module/tawk_to/tawk_to'),
		SessionHelper				= require('module/helpers/session_helper'),
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

	window.Server = serviceList;

	authController.initialize({
		binding:		binding,
		asPublicSchool:	true
	});
	// initializing all services (open too) only when we got all vars set in window.
	// this is not too very brilliant idea, but there is no other way to fix it quick
	serviceList.initializeOpenServices();

	userDataInstance.checkAndGetValidSessions()
		.then(sessions => {
			binding.set('userData', Immutable.fromJS(sessions));

			// setting context binding to data classes
			userDataInstance.setBinding(binding.sub('userData'));
			cookiePopupData.setBinding(binding.sub('schoolHomePage'));

			// Turning on authorization service
			serviceList.initialize(
				binding.sub('userData')
			);

			window.simpleAlert = SimpleAlertFactory.create(binding.sub('notificationAlertData'));
			window.confirmAlert = ConfirmAlertFactory.create(binding.sub('confirmAlertData'));

			ReactDom.render(
				React.createElement(MoreartyContext.bootstrap(SchoolApplicationView), null),
				document.getElementById('jsMain')
			);
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

	window.Server = serviceList;

	// setting context binding to data classes
	userDataInstance.setBinding(binding.sub('userData'));
	cookiePopupData.setBinding(binding.sub('schoolHomePage'));

	// Связывания контроллера, отвечающего за контроль за авторизацией с данными
	authController.initialize({
		binding:		binding,
		asPublicSchool:	true
	});

	// initializing all services (open too) only when we got all vars set in window.
	// this is not too very brilliant idea, but there is no other way to fix it quick
	// TODO: fix me
	serviceList.initializeOpenServices();
	// Turning on authorization service
	serviceList.initialize(
		binding.sub('userData')
	);

	userDataInstance.checkAndGetValidSessions()
		.then(sessions => {
			binding.set('userData', Immutable.fromJS(sessions));

			// setting context binding to data classes
			userDataInstance.setBinding(binding.sub('userData'));
			cookiePopupData.setBinding(binding.sub('schoolHomePage'));

			// Turning on authorization service
			serviceList.initialize(
				binding.sub('userData')
			).then(() => {
				window.simpleAlert = SimpleAlertFactory.create(binding.sub('notificationAlertData'));
				window.confirmAlert = ConfirmAlertFactory.create(binding.sub('confirmAlertData'));

				ReactDom.render(
					React.createElement(MoreartyContext.bootstrap(SchoolUnionApplicationView), null),
					document.getElementById('jsMain')
				);
			});
		});
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
			domain: schoolDomain,
			kind: {
				$in: ['School', 'SchoolUnion']
			}
		}
	};

	return serviceList.publicSchools.get({filter: filter}).then( schoolList => {
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