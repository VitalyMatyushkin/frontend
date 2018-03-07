/**
 * Created by wert on 26.02.2018
 */

import {DriverFactory} from "../tools/driver_factory";
import {LoginPage} from "../pages/login_page";
import {getRandomEmail} from "../tools/data_factory";


describe('Login page', () => {

	let driver;
	let baseUrl = 'http://app.squard.com:8080';

	before( async () => {
		driver = DriverFactory.getDriver();
		await driver.manage().timeouts().implicitlyWait(10000);
	});

	it('should login to squadintouch', async () => {
		const loginPage = new LoginPage(driver, baseUrl);
		await loginPage.visit();
		await loginPage.setEmail('a.v.povar@gmail.com');
		await loginPage.setPass('111111Ab');
		await loginPage.clickSubmit();
	});

	it('should allow to perform incorrect login 5 times', async () => {
		/* just trying to login 10 times with incorrect email/pass and clicking "Try again" */
		const loginPage = new LoginPage(driver, baseUrl);
		const email = getRandomEmail();

		await loginPage.visit();

		for(let i = 0; i < 5; i++) {
			await loginPage.setEmail(email);
			await loginPage.setPass('111111Ab');
			await loginPage.clickSubmit();
			await loginPage.clickTryAgain();
		}
	});


	after( async () => {
		if(driver) {
			await driver.quit();
		}
	});
});