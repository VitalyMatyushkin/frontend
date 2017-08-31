/**
 * Created by Vitaly on 31.05.17.
 */

const   test                    = require('selenium-webdriver/testing'),
        LoginPageTools          = require('../../lib/LoginPageTools.js'),
        OftenUsed               = require('../../lib/OftenUsed.js'),
        Driver                  = require('../Driver.js');

const   timeout = 50000;

Promise.USE_PROMISE_MANAGER = false;

test.describe('Wrong login/pass test', function(){
    this.timeout(timeout);
    let driver,
        wrongEmail = 'wrongEmail@mail.com',
        wrongPass = 'wrongPass';

    test.before(async () => {
        driver = Driver.startDriver();
    });

    test.it('test', async () => {
        let loginPageTools = new LoginPageTools(driver);
        await loginPageTools.visit();
        let email = await loginPageTools.getEmailWebElem();
        await OftenUsed.characterByCharacter(driver, email, wrongEmail);
        let password = await loginPageTools.getPassWebElem();
        await OftenUsed.characterByCharacter(driver, password, wrongPass);
        let submit = await loginPageTools.getSubmitWebElem();
        await submit.click();
        //Waiting to go to the page and checking this page
        await loginPageTools.checkErrorLoginPage();
        //Checking buttons
        await loginPageTools.getSignUpButton();
        let tryAgain = await loginPageTools.getTryAgainButton();
        await tryAgain.click();
    });

    test.after(async () => {
        await driver.quit();
    });
});








