import {By, WebDriver} from "selenium-webdriver";
import {Page} from "../page";
import {slowTyper} from "../../tools/slow_typer";

/**
 * Created by wert on 05.03.2018
 */

export class UserCreatePage extends Page {
	static readonly pagePath: string = '/#users/admin_views/create_user';

	private firstNameInputLocator		= By.id('firstname_input');
	private lastNameInputLocator		= By.id('lastname_input');
	private maleGenderInputLocator		= By.id('gender_input_0');
	private femaleGenderInputLocator	= By.id('gender_input_1');
	private phonePrefixLocator			= By.id('select_phone_prefix');
	private phoneInputLocator			= By.id('phone_input');

	private submitButtonLocator			= By.id('createUser_submit');
	private cancelButtonLocator			= By.id('createUser_cancel');

	constructor(driver: WebDriver, baseUrl: string) {
		super(driver, baseUrl, UserCreatePage.pagePath);
	}

	setFirstName(firstName: string) {
		return this.driver.findElement(this.firstNameInputLocator).sendKeys(firstName);
	}

	setLastName(lastName: string) {
		return this.driver.findElement(this.lastNameInputLocator).sendKeys(lastName);
	}

	setGender(gender: 'MALE'|'FEMALE') {
		if(gender === 'MALE') {
			return this.driver.findElement(this.maleGenderInputLocator).click();
		} else {
			return this.driver.findElement(this.femaleGenderInputLocator).click();
		}
	}

	async setPhone(fullPhone: string) {
		if(fullPhone.startsWith('+7')) {
			const phoneBody = fullPhone.substr('+7'.length);

			await this.driver.findElement(By.css('#select_phone_prefix>option[value=\'+7\']')).click();
			return slowTyper(this.driver, this.driver.findElement(this.phoneInputLocator), phoneBody);
		}
	}

	clickSubmit() {
		return this.driver.findElement(this.submitButtonLocator).click();
	}
}