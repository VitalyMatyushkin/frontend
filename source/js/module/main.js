var ApplicationView = require('module/main/application'),
	userDataClass = require('module/data/user_data'),
	serviceList = require('module/core/service_list'),
	MoreartyContext;

// Создание контекста Morearty
MoreartyContext = Morearty.createContext({
	initialState: {
		userData: userDataClass.getDefaultState(),
		routing: {
			current_page: 'main',
			parameters: {}
		},
		school: {},
		schools: {}
	}
});

// Общие каналы общения между модулями
window.SharedBindings = {};
window.Server = serviceList;

// Передача связывания контекста в классы данных
userDataClass.setBinding(MoreartyContext.getBinding().sub('userData'));

// Включение авторизации сервисов
serviceList.initialize(MoreartyContext.getBinding().sub('userData.authorizationInfo'));

// Инициализация приложения
React.render(
	React.createElement(MoreartyContext.bootstrap(ApplicationView), null),
	document.getElementById('jsMain')
);