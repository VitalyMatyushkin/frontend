/**
 * Created by wert on 26.02.2018
 */

/**
 * Created by root on 02.06.17.
 */

import {By} from 'selenium-webdriver';
import * as BPromise from 'bluebird';

class LoginPage{

	readonly driver: any;
	readonly pagePath: string = '/#login';
	readonly fullUrl: string;

	private inputEmailLocator = By.id('login_email');
	private inputPassLocator = By.id('login_password');
	private submitLoginLocator = By.id('login_submit');


	constructor(driver: any, baseUrl: string){
		this.driver = driver;
		this.fullUrl = baseUrl + this.pagePath;
	}

	async visit(): Promise<String> {
		await this.driver.get(this.fullUrl);
		const currentUrl = await this.driver.getCurrentUrl();

		if(currentUrl === this.fullUrl) {
			return BPromise.resolve(this.fullUrl);
		} else {
			return BPromise.reject(new Error(`url not found: ${this.fullUrl}`))
		}
	}

	async setEmail(email){
		const inputEmail = await this.driver.findElement(this.inputEmailLocator);
		await OftenUsed.characterByCharacter(this.driver,  inputEmail, email);
		return Promise.resolve(true);
	}

	async setPass(password){
		const inputPass = await this.driver.findElement(this.inputPassLocator);
		await OftenUsed.characterByCharacter(this.driver,  inputPass, password);
		return Promise.resolve(true);
	}

	async clickSubmit(){
		await this.driver.findElement(this.submitLoginLocator).click();
		return Promise.resolve(true);
	}

	async login(email, pass){
		await this.visit();
		await this.setEmail(email);
		await this.setPass(pass);
		return await this.clickSubmit();
	}

	static async loginAndSelectRole(driver, email, pass, role){
		const loginPage = new LoginPage(driver);
		const calendarPage = new CalendarPage(driver);
		await loginPage.login(email, pass);
		await calendarPage.checkSelectRolePage();
		await calendarPage.switchRole(role);
		return await calendarPage.checkCalendarPage();
	}
}

module.exports = LoginPage;