/**
 * Created by Vitaly on 20.06.17.
 */
const   {By,Builder, Capabilities}  = require('selenium-webdriver'),
        test                        = require('selenium-webdriver/testing'),
        OftenUsed                   = require('../lib/OftenUsed.js'),
        chrome                      = require('selenium-webdriver/chrome'),
        LoginPage                   = require('../lib/LoginPage.js'),
	    Driver                      = require('./Driver.js');

const   timeout = 2000000;

Promise.USE_PROMISE_MANAGER = false;

test.describe('Check text', function(){
    this.timeout(timeout);
    let driver,
        email = 'reference@squadintouch.com',
        inputLocator = By.id('login_email');

    test.before(async () => {
		driver = Driver.startDriver();
    });

    test.it('Visit page', async () => {
        let loginPage = new LoginPage(driver);
        await loginPage.visit();
    });
	test.it('Check text', async () => {
        for (let i=0; i<100; ++i) {
            let inputEmail = await driver.findElement(inputLocator);
            await inputEmail.clear();
            await OftenUsed.characterByCharacter(driver, inputEmail, email);
            await OftenUsed.checkAttributeWebElem(driver, inputLocator, 'value', email);
        }
	});
    test.after(async () => {
        await driver.quit()
    });
});



