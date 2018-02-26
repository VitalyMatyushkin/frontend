/**
 * Created by wert on 26.02.2018
 */

import * as WebDriverChrome	from 'selenium-webdriver/chrome';
import * as WebDriverFirefox from 'selenium-webdriver/firefox';
import * as chai from 'chai';
import * as chromedriver from 'chromedriver';
import * as	geckodriver from 'geckodriver';

import {Builder, By, Key, until} from 'selenium-webdriver';

const expect = chai.expect;


// simple factory to provide correct and tuned drivers
class DriverFactory {
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
		// return this.getFirefoxDriver();
	}
}



describe('Login page', () => {

	let driver;

	before( () => {
		driver = DriverFactory.getDriver();
	});


	it('should load yandex', async () => {
		await driver.get('http://ya.ru');
	});

	it('should load google', async () => {
		await driver.get('http://google.com');
	});


	after( async () => {
		if(driver) {
			await driver.quit();
		}
	});
});