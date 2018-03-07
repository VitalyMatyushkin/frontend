/**
 * Created by wert on 27.02.2018
 */

import {expect} from 'chai';
import {DriverFactory} from "../../tools/driver_factory";
import {LoginPage} from "../../pages/superadmin/login_page";
import {UsersPage} from "../../pages/superadmin/users_page";
import {Credentials} from "../../credentials";
import {WebDriver} from 'selenium-webdriver';
import {getRandomEmail} from "../../tools/data_factory";

describe('Superadmin Login page', () => {

	let driver: WebDriver;

	const	baseUrl		= Credentials.superadminBaseUrl,
			login		= Credentials.superadmin.login,
			password	= Credentials.superadmin.password;


	before( async () => {
		driver = DriverFactory.getDriver();
		await driver.manage().timeouts().implicitlyWait(15000);
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
		const loginPage	= new LoginPage(driver, baseUrl);
		const email = getRandomEmail();

		await loginPage.visit();
		await loginPage.setEmail(email);
		await loginPage.setPass('111111Ab');
		await loginPage.clickSubmit();

		const isAuthFailed = await loginPage.isAuthorizationFailed();
		expect(isAuthFailed).to.be.true;
	});

	it('should be able to retry login in case of mistake', async () => {
		const	loginPage	= new LoginPage(driver, baseUrl),
				usersPage	= new UsersPage(driver, baseUrl);

		await loginPage.visit();
		await loginPage.setEmail('random_main@fakemail.squadintouch.com');
		await loginPage.setPass('111111Ab');
		await loginPage.clickSubmit();

		const isAuthFailed = await loginPage.isAuthorizationFailed();
		expect(isAuthFailed).to.be.true;

		await loginPage.clickTryAgain();
		await loginPage.setEmail(login);
		await loginPage.setPass(password);
		await loginPage.clickSubmit();

		const isOnUsersPage = await usersPage.isOnPage();
		expect(isOnUsersPage).to.be.true;

	});


	after( async () => {
		if(driver) {
			await driver.quit();
		}
	});
});