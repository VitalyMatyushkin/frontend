import {WebDriver} from "selenium-webdriver";

/**
 * Created by wert on 27.02.2018
 */

export class RegisterPage {

	readonly driver: WebDriver;
	readonly pagePath: string = '/#register';
	readonly fullUrl: string;

	constructor(driver: WebDriver, baseUrl: string){
		this.driver = driver;
		this.fullUrl = baseUrl + this.pagePath;
	}



}