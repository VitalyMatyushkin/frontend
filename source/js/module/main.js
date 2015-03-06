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
			currentPath: '',
			currentPageName: '',
			currentPathParts: [],
			parameters: {}
		},
		school: {},
		schoolsList: {},
		schools: {
            list: []
        },
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

// Общие каналы общения между модулями
window.SharedBindings = {};
window.Server = serviceList;

// Передача связывания контекста в классы данных
userDataInstance.setBinding(binding.sub('userData'));
userRulesInstance.setBinding(binding.sub('userRules'));

// Включение авторизации сервисов
serviceList.initialize(binding.sub('userData.authorizationInfo'));

// Связывания контроллера, отвечающего за контроль за авторизацией с данными
authController.initialize(binding.sub('userData'));

// Инициализация приложения
React.render(
	React.createElement(MoreartyContext.bootstrap(ApplicationView), null),
	document.getElementById('jsMain')
);