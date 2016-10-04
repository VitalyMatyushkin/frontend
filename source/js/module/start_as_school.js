const 	ApplicationView 	= require('module/as_school/application'),
		SimpleAlertFactory	= require('./helpers/simple_alert_factory'),
		ConfirmAlertFactory	= require('./helpers/confirm_alert_factory'),
		serviceList 		= require('module/core/service_list'),
		userDataInstance 	= require('module/data/user_data'),
		authController 		= require('module/core/auth_controller'),
		Immutable			= require('immutable'),
		ReactDom 			= require('react-dom'),
		React 				= require('react'),
		Morearty			= require('morearty');

function initMainView(school) {
	const today = new Date();

	// creating morearty context
	const MoreartyContext = Morearty.createContext({
		initialState: {
			userData: 			userDataInstance.getDefaultState(),
			simpleAlertData: {
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

			},
			schoolHomePage: {					// wrapping to 'schoolHomePage' not to break router. I'm not sure we actually need that, but this is easiest way
				isPasswordPopupOpen:		false,
				isCookiePopupDisplaying:	true,	// by default we showing popup with cookie policy on each visit because we don't store this value anywhere in user's browser
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
	// Связывания контроллера, отвечающего за контроль за авторизацией с данными
	authController.initialize({
		binding:		binding,
		defaultPath:	'loginPublicSchool',
		asSchool:		true //Flag for public school page
	});

	// initializing all services (open too) only when we got all vars set in window.
	// this is not too very brilliant idea, but there is no other way to fix it quick
	// TODO: fix me
	serviceList.initializeOpenServices();

	// Turning on authorization service
	serviceList.initialize(binding.sub('userData.authorizationInfo'));

	window.simpleAlert = SimpleAlertFactory.create(binding.sub('simpleAlertData'));
	window.confirmAlert = ConfirmAlertFactory.create(binding.sub('confirmAlertData'));

	ReactDom.render(
		React.createElement(MoreartyContext.bootstrap(ApplicationView), null),
		document.getElementById('jsMain')
	);
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
			domain: schoolDomain
		}
	};

	return serviceList.publicSchools.get({filter: filter}).then( schoolList => {
		const optSchool = schoolList[0];
		if(optSchool) {
			initMainView(optSchool);
		} else {
			init404View();
		}
	});
}

module.exports = runMainMode;