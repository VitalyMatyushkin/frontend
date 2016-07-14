/**
 * Created by wert on 16.01.16.
 */
const   ApplicationView     = require('module/as_password/application'),
        userDataInstance    = require('module/data/user_data'),
        userRulesInstance   = require('module/data/user_rules'),
        authController      = require('module/core/auth_controller'),
        serviceList         = require('module/core/service_list'),
        Morearty			= require('morearty'),
        ReactDom            = require('react-dom'),
        React               = require('react');

function runPasswordMode() {
// Create Morearty context
    const MoreartyContext = Morearty.createContext({
        initialState: {
            userData: userDataInstance.getDefaultState(),
            userRules: userRulesInstance.getDefaultState(),
            routing: {
                currentPath: '',
                currentPageName: '',	// current page name, if exist
                currentPathParts: [],
                pathParameters: [],
                parameters: {}			// GET-params of current path
            }
        },
        options: {
            requestAnimationFrameEnabled: true
        }
    });

    const binding = MoreartyContext.getBinding();

    window.Server = serviceList;

    // Передача связывания контекста в классы данных
    userDataInstance.setBinding(binding.sub('userData'));
    userRulesInstance.setBinding(binding.sub('userRules'));

    // Enable servises
    serviceList.initialize(binding.sub('userData.authorizationInfo'));

    // Связывания контроллера, отвечающего за контроль за авторизацией с данными
    authController.initialize(
        {
            binding: binding,
            defaultPath: ''
        }
    );


    // Инициализация приложения
    ReactDom.render(
        React.createElement(MoreartyContext.bootstrap(ApplicationView), null),
        document.getElementById('jsMain')
    );
}

module.exports = runPasswordMode;
