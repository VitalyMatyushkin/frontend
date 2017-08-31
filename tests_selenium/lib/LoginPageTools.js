/**
 * Created by root on 05.06.17.
 */
const   {By, until}  = require('selenium-webdriver'),
        Constants    = require('./Constants.js');

class LoginPageTools{
    constructor(driver){
        this.driver = driver;
        this.url = Constants.domain + '/#login';
        this.inputEmailLocator = By.id('login_email');
        this.inputPassLocator = By.id('login_password');
        this.submitLoginLocator = By.id('login_submit');
        this.errorTitleLocator = By.xpath('.//*[text()="Authorization failed"]/..');
        this.tryAgainLocator  = By.linkText('try again →');
        this.singUpLocator = By.linkText('sign up');
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


    async getEmailWebElem(){
        return this.driver.findElement(this.inputEmailLocator);
    }

    async getPassWebElem() {
        return this.driver.findElement(this.inputPassLocator);
    }

    async getSubmitWebElem() {
        return this.driver.findElement(this.submitLoginLocator);
    }

    async checkErrorLoginPage(){
        return this.driver.wait(until.elementLocated(this.errorTitleLocator));
    }

    async getTryAgainButton(){
        return this.driver.findElement(this.tryAgainLocator);
    }

    async getSignUpButton(){
        return this.driver.findElement(this.singUpLocator);
    }
}

module.exports = LoginPageTools;
