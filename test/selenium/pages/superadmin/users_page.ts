/**
 * Created by wert on 27.02.2018
 */

import {By, WebDriver, WebElement} from 'selenium-webdriver';
import {Page} from "../page";

export class UsersPage extends Page {
	static readonly pagePath: string = '/#users/users';

	private addUserButtonLocator = By.id('addUser_button');

	constructor(driver: WebDriver, baseUrl: string, pagePath: string = UsersPage.pagePath) {
		super(driver, baseUrl, pagePath);
	}

	clickAddUser() {
		return this.driver.findElement(this.addUserButtonLocator).click();
	}

}