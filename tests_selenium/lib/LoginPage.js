/**
 * Created by root on 02.06.17.
 */
const   {By}            = require('selenium-webdriver'),
        Constants       = require('./Constants.js'),
        CalendarPage    = require('./Pages/CalendarPage'),
        OftenUsed       = require('./OftenUsed.js');

class LoginPage{
    constructor(driver){
        this.driver = driver;
        this.url = Constants.domain + '/#login';
        this.inputEmailLocator = By.id('login_email');
        this.inputPassLocator = By.id('login_password');
        this.submitLoginLocator = By.id('login_submit');
    }

    async visit(){
        await this.driver.get(this.url);
        const currentUrl = await this.driver.getCurrentUrl();
        return new Promise(
            (resolve, reject) => {
                if (currentUrl === this.url){
                    resolve(true);
                } else {
                    reject(new Error('url was not found'));
                }
            }
        );
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