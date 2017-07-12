/**
 * Created by Vitaly on 11.07.17.
 */

const   ApplicationView 	= require('module/test_api/application'),
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
