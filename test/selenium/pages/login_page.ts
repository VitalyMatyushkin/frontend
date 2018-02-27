/**
 * Created by wert on 26.02.2018
 */

import {By, WebDriver, WebElement} from 'selenium-webdriver';

export class LoginPage {

	readonly driver: WebDriver;
	readonly pagePath: string = '/#login';
	readonly fullUrl: string;

	private inputEmailLocator = By.id('login_email');
	private inputPassLocator = By.id('login_password');
	private submitLoginLocator = By.id('login_submit');

	private tryAgainButtonLocator = By.id('tryAgain_button');
	private signUpButtonLocator = By.id('signUp_button');


	constructor(driver: WebDriver, baseUrl: string){
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

	async isOnPage() {
		const currentUrl = await this.driver.getCurrentUrl();
		return currentUrl === this.fullUrl;
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

	/** I don't think following parts should be part of login page, but right now it is.
	 *  I believe we will fix it in frontend in favor of Scene -> Page -> Components approach
	 */

	async clickTryAgain() {
		return this.driver.findElement(this.tryAgainButtonLocator).click();
	}

	async clickSignUp() {
		return this.driver.findElement(this.signUpButtonLocator).click();
	}

}