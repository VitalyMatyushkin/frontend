/**
 * Created by Vitaly on 07.06.17.
 */

const   {By}            = require('selenium-webdriver'),
        test            = require('selenium-webdriver/testing'),
        LoginPage       = require('../../lib/LoginPage.js'),
        CalendarPage    = require('../../lib/Pages/CalendarPage.js'),
        OftenUsed       = require('../../lib/OftenUsed.js'),
        Driver          = require('../Driver.js');

const   timeout             = 70000,
        selectRoleLocator   = By.className('bRoleSelector'),
        loginLocator        = By.className('bLoginForm');

Promise.USE_PROMISE_MANAGER = false;

test.describe('Check login page', function(){
    this.timeout(timeout);
    let driver,
        email = 'reference@squadintouch.com',
        pass = 'reference';

    test.before(async () => {
        driver = Driver.startDriver();
    });

    test.it('Login page', async () => {
        let loginPage = new LoginPage(driver);
        await loginPage.visit();
        await OftenUsed.checkPage(loginLocator, driver);
    });

    test.it('login', async () => {
        //login user
        let loginPage = new LoginPage(driver);
        await loginPage.setEmail(email);
        await loginPage.setPass(pass);
        await loginPage.clickSubmit();
    });

    test.it('Select role page', async () => {
        await OftenUsed.checkPage(selectRoleLocator, driver);
    });


    test.after(async () => {
        await driver.quit()
    });
});

