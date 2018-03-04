import {Credentials} from "../../credentials";
import {WebDriver} from "selenium-webdriver";
import {DriverFactory} from "../../tools/driver_factory";

/**
 * Created by wert on 04.03.2018
 */

describe('superadmin users page', () => {
	let driver: WebDriver;

	const	baseUrl		= Credentials.superadminBaseUrl,
			login		= Credentials.superadmin.login,
			password	= Credentials.superadmin.password;

	before( async () => {
		driver = DriverFactory.getDriver();
		await driver.manage().timeouts().implicitlyWait(15000);
	});

	it('should be able to new user');
	it('should be able to edit user');
	it('should be able to find created user');


	after( async () => {
		if(driver) {
			await driver.quit();
		}
	});
});