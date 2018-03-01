/**
 * Created by wert on 27.02.2018
 */

import {By, WebDriver, WebElement} from 'selenium-webdriver';

export class UsersPage {

	readonly driver: WebDriver;
	readonly fullUrl: string;

	readonly pagePath: string = '/#users/users';

	constructor(driver: WebDriver, baseUrl: string) {
		this.driver = driver;
		this.fullUrl = baseUrl + this.pagePath;
	}

	async visit(): Promise<string> {
		await this.driver.get(this.fullUrl);
		const currentUrl = await this.driver.getCurrentUrl();

		if(currentUrl === this.fullUrl) {
			return this.fullUrl;
		} else {
			throw new Error(`url not found: ${this.fullUrl}`);
		}
	}

	async isOnPage(): Promise<boolean> {
		return this.driver.wait(async () => {
			const currentUrl = await this.driver.getCurrentUrl();
			return currentUrl === this.fullUrl;
		});
	}

}