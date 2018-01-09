/**
 * Created by wert on 16.01.16.
 */
const	ApplicationView		= require('module/as_password/application'),
		{SimpleAlertFactory}	= require('./helpers/simple_alert_factory'),
		{ConfirmAlertFactory}	= require('./helpers/confirm_alert_factory'),
		userDataInstance	= require('module/data/user_data'),
		userRulesInstance	= require('module/data/user_rules'),
		{authController}	= require('module/core/auth_controller'),
		{ServiceList} = require("module/core/service_list/service_list"),
		initTawkTo			= require('module/tawk_to/tawk_to'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),
		ReactDom			= require('react-dom'),
		React				= require('react');

function runPasswordMode() {
// Create Morearty context
    const MoreartyContext = Morearty.createContext({
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

	window.Server = new ServiceList(binding.sub('userData'));

	userDataInstance.checkAndGetValidSessions()
		.then(sessions => {
			binding.set('userData', Immutable.fromJS(sessions));

			// Передача связывания контекста в классы данных
			userDataInstance.setBinding(binding.sub('userData'));
			userRulesInstance.setBinding(binding.sub('userRules'));

			window.simpleAlert = SimpleAlertFactory.create(binding.sub('notificationAlertData'));
			window.confirmAlert = ConfirmAlertFactory.create(binding.sub('confirmAlertData'));


			// Связывания контроллера, отвечающего за контроль за авторизацией с данными
			authController.initialize(
				{
					binding: binding
				}
			).then(() => {
				// Инициализация приложения
				ReactDom.render(
					React.createElement(MoreartyContext.bootstrap(ApplicationView), null),
					document.getElementById('jsMain')
				);

				authController.redirectUserByUserAuthData();

				initTawkTo();
			});
		});
}

module.exports = runPasswordMode;
