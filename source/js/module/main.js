var ApplicationView = require('module/main/application'),
	userDataInstance = require('module/data/user_data'),
	authController = require('module/core/auth_controller'),
	serviceList = require('module/core/service_list'),
	MoreartyContext,
	binding;

// Создание контекста Morearty
MoreartyContext = Morearty.createContext({
	initialState: {
		userData: userDataInstance.getDefaultState(),
		routing: {
			current_page: 'main',
			parameters: {}
		},
		school: {},
		schools: {},
		events: {
            models: [],
            calendar: {
                currentDate: new Date(),
                mode: 'month'
            }
        }
	}
});

binding = MoreartyContext.getBinding();

// Общие каналы общения между модулями
window.SharedBindings = {};
window.Server = serviceList;

// Передача связывания контекста в классы данных
userDataInstance.setBinding(binding.sub('userData'));

// Включение авторизации сервисов
serviceList.initialize(binding.sub('userData.authorizationInfo'));

// Связывания контроллера, отвечающего за контроль за авторизацией с данными
authController.initialize(binding.sub('userData'));

// Инициализация приложения
React.render(
	React.createElement(MoreartyContext.bootstrap(ApplicationView), null),
	document.getElementById('jsMain')
);