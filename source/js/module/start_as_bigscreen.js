const React = require('react');
const Immutable = require('immutable');
const ReactDom = require('react-dom');
const Morearty = require('morearty');

const {authController} = require('module/core/auth_controller');
const ApplicationView  = require('./as_bigscreen/application');
const userDataInstance = require('module/data/user_data');

const {ServiceList} = require("module/core/service_list/service_list");
const {OpenServiceList} = require('module/core/service_list/open_service_list');

const BigscreenConsts = require('./as_bigscreen/pages/consts/consts');

function initMainView(school) {
	// creating morearty context
	const MoreartyContext = Morearty.createContext({
		initialState: {
			userData:   		userDataInstance.getDefaultState(),
			activeSchoolId: 	school.id,
			activeSchool:		Immutable.fromJS(school),
			routing: {
				currentPath:        '',     // текущий путь
				currentPageName:    '',     // имя текущей страницы, если есть
				currentPathParts:   [],     // части текущего путии
				pathParameters:     [],     // параметры текущего пути (:someParam) в порядке объявления
				parameters:         {}      // GET-параметры текущего пути
			},
			loginPublicBigscreen: {
				hashOfRedirectPageAfterLogin: 'home'
			},
			bigScreenMainPage: {
				events: {							// will keep all data related to showing events on main page here
					prevSevenDaysFinishedEvents: {
						isSync:	false,
						events:	[]
					},
					nextSevenDaysEvents: {
						isSync:	false,
						events:	[]
					},
					footerEvents: {
						isSync:				false,
						events:				[],
						currentEventIndex:	undefined
					},
					highlightEvent: {
						event:	{},
						photos:	{},
						isSync:	false
					}
				},
				currentState: BigscreenConsts.BIGSCREEN_STATES_MODE.RECENT
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

			userDataInstance.setBinding(binding.sub('userData'));

			// Turning on authorization service
			authController.initialize({
				binding:		binding,
				asBigscreen:	true
			})
			.then(() => {
				ReactDom.render(
					React.createElement(
						MoreartyContext.bootstrap(ApplicationView), null),
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

	const schoolDomain = document.location.host.split('.')[0].substring(10);

	const filter = {
		where: {
			domain: schoolDomain
		}
	};

	return openServiceList.publicSchools.get({filter: filter}).then( schoolList => {
		const optSchool = schoolList[0];
		if(optSchool) {
			initMainView(optSchool);
		} else {
			init404View();
		}
	});
}

module.exports = runMainMode;