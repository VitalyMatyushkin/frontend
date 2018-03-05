import {Credentials} from "../../credentials";
import {WebDriver} from "selenium-webdriver";
import {DriverFactory} from "../../tools/driver_factory";
import {LoginPage} from "../../pages/superadmin/login_page";
import {UsersPage} from "../../pages/superadmin/users_page";
import {UserCreatePage} from "../../pages/superadmin/user_create_page";

/**
 * Created by wert on 04.03.2018
 */

describe.only('superadmin users page', () => {
	let driver: WebDriver;

	const	baseUrl		= Credentials.superadminBaseUrl,
			login		= Credentials.superadmin.login,
			password	= Credentials.superadmin.password;

	before( async () => {
		driver = DriverFactory.getDriver();
		await driver.manage().timeouts().implicitlyWait(15000);
	});

	it('should be able to add new user', async () => {
		const	loginPage		= new LoginPage(driver, baseUrl),
				usersPage		= new UsersPage(driver, baseUrl),
				userCreatePage	= new UserCreatePage(driver, baseUrl);

		await loginPage.login(login, password);
		await usersPage.waitToBeOnPage();
		await usersPage.clickAddUser();

		await userCreatePage.waitToBeOnPage();
		await userCreatePage.setFirstName('John');
		await userCreatePage.setLastName('TheTester');



		await userCreatePage.clickSubmit();
	});


	it('should be able to edit user');
	it('should be able to find created user');


	after( async () => {
		if(driver) {
			await driver.quit();
		}
	});
});