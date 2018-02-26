import * as WebDriverChrome from "selenium-webdriver/chrome";
import * as WebDriverFirefox from "selenium-webdriver/firefox";
import * as chromedriver from 'chromedriver';
import * as	geckodriver from 'geckodriver';

/**
 * Created by wert on 26.02.2018
 */

// simple factory to provide correct and tuned drivers
export class DriverFactory {

	static getChromeDriver() {
		const 	service = new WebDriverChrome.ServiceBuilder(chromedriver.path).build(),
			options = new WebDriverChrome.Options();

		return WebDriverChrome.Driver.createSession(options, service);
	}

	static getFirefoxDriver() {
		const	service = new WebDriverFirefox.ServiceBuilder(geckodriver.path).build(),
			options	= new WebDriverFirefox.Options();

		return WebDriverFirefox.Driver.createSession(options, service);
	}

	static getDriver(){
		return this.getChromeDriver();
	}
}
