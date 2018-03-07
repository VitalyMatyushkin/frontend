/**
 * Created by wert on 27.02.2018
 */

import {By, WebDriver, WebElement} from 'selenium-webdriver';
import {Page} from "../page";

export class UsersPage extends Page {
	static readonly pagePath: string = '/#users/users';

	private addUserButtonLocator = By.id('addUser_button');
	private gridFilterButtonLocator = By.id('gridFilter_button');

	private gridFilterEmailInput = By.id('userEmailFilter_input');

	constructor(driver: WebDriver, baseUrl: string, pagePath: string = UsersPage.pagePath) {
		super(driver, baseUrl, pagePath);
	}

	clickAddUser() {
		return this.driver.findElement(this.addUserButtonLocator).click();
	}

	clickFilterButton() {
		// this part should be moved to "models"
		// grids should are working almost the same way, so need to move it to grid model test component
		// but a bit later
		return this.driver.findElement(this.gridFilterButtonLocator).click();
	}

	setEmailFilter(email: string) {
		return this.driver.findElement(this.gridFilterEmailInput).sendKeys(email);
	}

}