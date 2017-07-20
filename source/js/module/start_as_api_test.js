/**
 * Created by Vitaly on 11.07.17.
 */

const   ApplicationView 	= require('module/as_api_test/application'),
        ReactDom 			= require('react-dom'),
        React 				= require('react');

function runTestApi() {


    // Инициализация приложения
    ReactDom.render(
        React.createElement(ApplicationView, null),
        document.getElementById('jsMain')
    );

}

module.exports = runTestApi;
