import {By, WebDriver} from "selenium-webdriver";
import {Page} from "../page";

/**
 * Created by wert on 05.03.2018
 */

export class UserCreatePage extends Page {
	static readonly pagePath: string = '/#users/admin_views/create_user';

	private firstNameInputLocator = By.id('firstname_input');
	private lastNameInputLocator = By.id('lastname_input');
	private genderInputLocator = By.id('gender_input');
	private submitButtonLocator = By.id('createUser_submit');
	private cancelButtonLocator = By.id('createUser_cancel');

	constructor(driver: WebDriver, baseUrl: string) {
		super(driver, baseUrl, UserCreatePage.pagePath);
	}

	setFirstName(firstName: string) {
		return this.driver.findElement(this.firstNameInputLocator).sendKeys(firstName);
	}

	setLastName(lastName: string) {
		return this.driver.findElement(this.lastNameInputLocator).sendKeys(lastName);
	}

	clickSubmit() {
		return this.driver.findElement(this.submitButtonLocator).click();
	}
}