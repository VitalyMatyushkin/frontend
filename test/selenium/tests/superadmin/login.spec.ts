/**
 * Created by wert on 27.02.2018
 */

import {expect} from 'chai';
import {DriverFactory} from "../../tools/driver_factory";
import {LoginPage} from "../../pages/superadmin/login_page";
import {UsersPage} from "../../pages/superadmin/users_page";
import {Credentials} from "../../credentials";

describe('Superadmin Login page', () => {

	let driver;

	const	baseUrl		= Credentials.superadminBaseUrl,
			login		= Credentials.superadmin.login,
			password	= Credentials.superadmin.password;


	before( async () => {
		driver = DriverFactory.getDriver();
		await driver.manage().timeouts().implicitlyWait(10000);

		const timeouts = await driver.manage().getTimeouts();
		console.log('got timeouts: ' + JSON.stringify(timeouts));
	});

	it('should login to squadintouch superadmin website', async () => {
		const	loginPage	= new LoginPage(driver, baseUrl),
				usersPage	= new UsersPage(driver, baseUrl);

		await loginPage.visit();
		await loginPage.setEmail(login);
		await loginPage.setPass(password);
		await loginPage.clickSubmit();

		const isOnUsersPage = await usersPage.isOnPage();
		expect(isOnUsersPage).to.be.true;
	});

	it('should not pass incorrect login', async () => {
		const	loginPage	= new LoginPage(driver, baseUrl),
				usersPage	= new UsersPage(driver, baseUrl);

		await loginPage.visit();
		await loginPage.setEmail('random_main@fakemail.squadintouch.com');
		await loginPage.setPass('111111Ab');
		await loginPage.clickSubmit();

		const isOnUsersPage = await usersPage.isOnPage();
		expect(isOnUsersPage).to.be.false;
	});

	// it('should allow to perform incorrect login 10 times', async () => {
	// 	/* just trying to login 10 times with incorrect email/pass and clicking "Try again" */
	// 	const loginPage = new LoginPage(driver, baseUrl);
	// 	await loginPage.visit();
	//
	// 	for(let i = 0; i < 10; i++) {
	// 		await loginPage.setEmail('invalid_email@fakemail.squadintouch.com');
	// 		await loginPage.setPass('111111Ab');
	// 		await loginPage.clickSubmit();
	// 		await loginPage.clickTryAgain();
	// 	}
	// });


	after( async () => {
		if(driver) {
			await driver.quit();
		}
	});
});