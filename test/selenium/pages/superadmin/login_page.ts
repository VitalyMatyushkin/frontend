/**
 * Created by wert on 27.02.2018
 */

import {By, WebDriver, WebElement} from 'selenium-webdriver';
import {Page} from "../page";


export class LoginPage extends Page {
	static readonly pagePath: string = '/#login';

	private inputEmailLocator = By.id('login_email');
	private inputPassLocator = By.id('login_password');
	private submitLoginLocator = By.id('login_submit');

	private tryAgainButtonLocator = By.id('tryAgain_button');
	private signUpButtonLocator = By.id('signUp_button');

	constructor(driver: WebDriver, baseUrl: string) {
		super(driver, baseUrl, LoginPage.pagePath);
	}

	async setEmail(email: string){
		const emailInput: WebElement = await this.driver.findElement(this.inputEmailLocator);
		await emailInput.sendKeys(email);
	}

	async setPass(password: string){
		const passwordInput: WebElement = await this.driver.findElement(this.inputPassLocator);
		await passwordInput.sendKeys(password);
	}

	async clickSubmit(){
		const submitButton: WebElement = await this.driver.findElement(this.submitLoginLocator);
		await submitButton.click();
	}

	async login(email: string, pass: string){
		await this.visit();
		await this.setEmail(email);
		await this.setPass(pass);
		return this.clickSubmit();
	}

	async clickTryAgain() {
		const tryAgainButton: WebElement = this.driver.findElement(this.tryAgainButtonLocator);
		await tryAgainButton.click();
	}

	async isAuthorizationFailed(): Promise<boolean> {
		try {
			const	tryAgainButtonPromise	= this.driver.findElement(this.tryAgainButtonLocator),
					signUpButtonPromise		= this.driver.findElement(this.signUpButtonLocator);

			await Promise.all([tryAgainButtonPromise, signUpButtonPromise]);
			return true;
		} catch (e){
			return false;
		}




	}

}