var ApplicationView = require('module/main/application'),
	userDataInstance = require('module/data/user_data'),
	userRulesInstance = require('module/data/user_rules'),
	authController = require('module/core/auth_controller'),
	serviceList = require('module/core/service_list'),
	MoreartyContext,
	binding;

// Создание контекста Morearty
MoreartyContext = Morearty.createContext({
	initialState: {
		userData: userDataInstance.getDefaultState(),
		userRules: userRulesInstance.getDefaultState(),
		routing: {
			currentPath: '',		// текущий путь
			currentPageName: '',	// имя текущей страницы, если есть
			currentPathParts: [],	// части текущего путии
			pathParameters: [],		// параметры текущего пути (:someParam) в порядке объявления
			parameters: {}			// GET-параметры текущего пути
		},
		activeSchool: {
			classes: {
				pupilsList: [],
				pupilsRouting: {},
				pupilForm: {}
			},
			houses: {
				pupilsList: [],
				pupilsRouting: {},
				pupilForm: {}
			},
			pupils: {
				pupilsList: [],
				pupilsRouting: {},
				pupilForm: {}
			},
			summary: {},
			schoolRouting: {}
		},
		schoolsList: [],
		events: {
            sync: false,
            models: [],
            calendar: {
                currentDate: new Date(),
                mode: 'month'
            }
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
        }
	},
    options: {
        requestAnimationFrameEnabled: true
    }
});

binding = MoreartyContext.getBinding();

window.Server = serviceList;

// Передача связывания контекста в классы данных
userDataInstance.setBinding(binding.sub('userData'));
userRulesInstance.setBinding(binding.sub('userRules'));

// Включение авторизации сервисов
serviceList.initialize(binding.sub('userData.authorizationInfo'));

// Связывания контроллера, отвечающего за контроль за авторизацией с данными
authController.initialize(binding);

// Инициализация приложения
React.render(
	React.createElement(MoreartyContext.bootstrap(ApplicationView), null),
	document.getElementById('jsMain')
);