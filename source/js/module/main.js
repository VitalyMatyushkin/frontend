var ApplicationView = require('module/main/application'),
	userDataClass = require('module/data/user_data'),
	MoreartyContext;

// Создание контекста Morearty
MoreartyContext = Morearty.createContext({
	initialState: {
		userData: userDataClass.getDefaultState(),
		routing: {
			current_page: 'main'
		}
	}
});

// Общие каналы общения между модулями
window.SharedBindings = {};

// Передача связывания контекста в классы данных
userDataClass.setBinding(MoreartyContext.getBinding().sub('userData'));

// Инициализация приложения
React.render(
	React.createElement(MoreartyContext.bootstrap(ApplicationView), null),
	document.getElementById('jsMain')
);