/**
 * Created by wert on 26.02.2018
 */
const	wd					= require('selenium-webdriver'),
		WebDriverChrome		= require('selenium-webdriver/chrome'),
		WebDriverFirefox	= require('selenium-webdriver/firefox'),
		chai				= require('chai'),
		chromedriver		= require('chromedriver'),
		geckodriver			= require('geckodriver');

const {Builder, By, Key, until} = require('selenium-webdriver');

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

	it('should login to squadintouch', async () => {
		await driver.get('http://app.stage1.squadintouch.com');
		const	loginField		= await driver.findElement(By.id('login_email')),
			  	passField		= await driver.findElement(By.id('login_password')),
				submitButton	= await driver.findElement(By.id('login_submit'));

		await loginField.sendKeys('a.v.povar@gmail.com');
		await passField.sendKeys('111111Ab');
		await submitButton.click();
	});

	// it('should load yandex', async () => {
	// 	await driver.get('http://ya.ru');
	// });
	//
	// it('should load google', async () => {
	// 	await driver.get('http://google.com');
	// });


	after( async () => {
		if(driver) {
			await driver.quit();
		}
	});
});