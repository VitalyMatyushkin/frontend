const   ApplicationView     = require('module/as_admin/application'),
        userDataInstance    = require('module/data/user_data'),
        userRulesInstance   = require('module/data/user_rules'),
        authController      = require('module/core/auth_controller'),
        serviceListAdmin    = require('module/core/service_list_admin'),
        ReactDom            = require('reactDom'),
        React               = require('react');

function runAdminMode() {
// Creating Morearty context
    const MoreartyContext = Morearty.createContext({
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

    window.Server = serviceListAdmin;

// Передача связывания контекста в классы данных
    userDataInstance.setBinding(binding.sub('userData'));
    userRulesInstance.setBinding(binding.sub('userRules'));

// Включение авторизации сервисов
    serviceListAdmin.initialize(binding.sub('userData.authorizationInfo'));

// Связывания контроллера, отвечающего за контроль за авторизацией с данными
    authController.initialize({
        binding: binding,
        defaultPath: 'admin_schools'
    });

// Инициализация приложения
    ReactDom.render(
        React.createElement(MoreartyContext.bootstrap(ApplicationView), null),
        document.getElementById('jsMain')
    );
}

module.exports = runAdminMode;