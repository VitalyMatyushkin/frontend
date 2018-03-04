/**
 * Created by wert on 27.02.2018
 */

import {By, WebDriver, WebElement} from 'selenium-webdriver';
import {Page} from "../page";

export class UsersPage extends Page {
	static readonly pagePath: string = '/#users/users';

	constructor(driver: WebDriver, baseUrl: string) {
		super(driver, baseUrl, UsersPage.pagePath);
	}
}