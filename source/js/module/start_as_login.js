/**
 * Created by wert on 16.01.16.
 */
const   ApplicationView     = require('module/as_login/application'),
        SimpleAlertFactory	= require('./helpers/simple_alert_factory'),
        ConfirmAlertFactory	= require('./helpers/confirm_alert_factory'),
        userDataLogin 		= require('module/data/user_data_login'),
        userRulesInstance   = require('module/data/user_rules'),
        authController      = require('module/core/auth_controller'),
        serviceList         = require('module/core/service_list'),
        initTawkTo			= require('module/tawk_to/tawk_to'),
        ReactDom            = require('react-dom'),
        React               = require('react'),
        Morearty            = require('morearty');

    function runLoginMode() {

// Create Morearty context
    const MoreartyContext = Morearty.createContext({
        initialState: {
            userData: userDataLogin.getDefaultState(),
            userRules: userRulesInstance.getDefaultState(),
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
            routing: {
                currentPath: '',
                currentPageName: '',	// current page name, if exist
                currentPathParts: [],
                pathParameters: [],
                parameters: {}			// GET-params of current path
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

    window.Server = serviceList;

    // Передача связывания контекста в классы данных
    userDataLogin.setBinding(binding.sub('userData'));
    userRulesInstance.setBinding(binding.sub('userRules'));

	// initializing all services (open too) only when we got all vars set in window.
	// this is not too very brilliant idea, but there is no other way to fix it quick
	// TODO: fix me
	serviceList.initializeOpenServices();
    // Enable services
    serviceList.initialize(binding.sub('userData.authorizationInfo'));

    // Связывания контроллера, отвечающего за контроль за авторизацией с данными
    authController.initialize({
            binding: binding,
            defaultPath: 'login'
	});


    window.simpleAlert = SimpleAlertFactory.create(binding.sub('notificationAlertData'));
    window.confirmAlert = ConfirmAlertFactory.create(binding.sub('confirmAlertData'));

    // Инициализация приложения
    ReactDom.render(
        React.createElement(MoreartyContext.bootstrap(ApplicationView), null),
        document.getElementById('jsMain')
    );

	initTawkTo();
}

module.exports = runLoginMode;
