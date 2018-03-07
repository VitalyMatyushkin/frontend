import {By, WebDriver} from "selenium-webdriver";
import {Page} from "../page";
import {slowTyper} from "../../tools/slow_typer";

/**
 * Created by wert on 05.03.2018
 */

export class UserCreatePage extends Page {
	static readonly pagePath: string = '/#users/admin_views/create_user';

	private firstNameInputLocator				= By.id('firstname_input');
	private lastNameInputLocator				= By.id('lastname_input');
	private maleGenderInputLocator				= By.id('gender_input_0');
	private femaleGenderInputLocator			= By.id('gender_input_1');
	private phonePrefixLocator					= By.id('select_phone_prefix');
	private phoneInputLocator					= By.id('phone_input');
	private emailInputLocator					= By.id('email_input');
	private emailConfirmInputLocator			= By.id('email_input_2');
	private passwordInputLocator				= By.id('password_input');
	private passwordConfirmInputLocator			= By.id('password_input_2');
	private maxIosSessionCountInputLocator		= By.id('maxIosSessionCount_input');
	private maxAndroidSessionCountInputLocator	= By.id('maxAndroidSessionCount_input');
	private maxWebSessionCountInputLocator		= By.id('maxWebSessionCount_input');

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

		if(fullPhone.startsWith('+44')) {
			const phoneBody = fullPhone.substr('+44'.length);

			await this.driver.findElement(By.css('#select_phone_prefix>option[value=\'+44\']')).click();
			return slowTyper(this.driver, this.driver.findElement(this.phoneInputLocator), phoneBody);
		}
	}

	setEmail(email: string) {
		return this.driver.findElement(this.emailInputLocator).sendKeys(email);
	}

	setEmailConfirmation(email: string) {
		return this.driver.findElement(this.emailConfirmInputLocator).sendKeys(email);
	}

	setPassword(password: string) {
		return this.driver.findElement(this.passwordInputLocator).sendKeys(password);
	}

	setPasswordConfirmation(password: string) {
		return this.driver.findElement(this.passwordConfirmInputLocator).sendKeys(password);
	}

	setMaxIosSessionCount(n: number) {
		return this.driver.findElement(this.maxIosSessionCountInputLocator).sendKeys(n);
	}

	setMaxAndroidSessionCount(n: number) {
		return this.driver.findElement(this.maxAndroidSessionCountInputLocator).sendKeys(n);
	}

	setMaxWebSessionCount(n: number) {
		return this.driver.findElement(this.maxWebSessionCountInputLocator).sendKeys(n);
	}

	clickSubmit() {
		return this.driver.findElement(this.submitButtonLocator).click();
	}
}