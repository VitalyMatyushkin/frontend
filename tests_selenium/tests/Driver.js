/**
 * Created by Vitaly on 07.06.17.
 */
const   chrome                  = require('selenium-webdriver/chrome'),
        chromedriver            = require('chromedriver');

class Driver{
    static startDriver(){
		const 	service = new chrome.ServiceBuilder(chromedriver.path).build(),
				options = new chrome.Options();

		return chrome.Driver.createSession(options, service);
    }
}

module.exports = Driver;
