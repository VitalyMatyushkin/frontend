/**
 * Created by Vitaly on 01.06.17.
 */

const   test                    = require('selenium-webdriver/testing'),
        LoginPage               = require('../lib/LoginPage.js'),
        CalendarPage            = require('../lib/Pages/CalendarPage.js'),
        Driver                  = require('./Driver.js');

const   timeout = 50000;

Promise.USE_PROMISE_MANAGER = false;

test.describe('User login with one role', function() {
    this.timeout(timeout);
    let driver;
    const   email = 'onerole@one.com',
            pass = 'Onerole2017',
            school = 'Great Walstead School',
            role = 'admin';

    test.before(async () => {
		driver = Driver.startDriver();
    });

    test.it('test', async () => {
        //login user
        let loginPage = new LoginPage(driver);
        let calendarPage = new CalendarPage(driver);
        await loginPage.visit();
        await loginPage.setEmail(email);
        await loginPage.setPass(pass);
        await loginPage.clickSubmit();
        //Waiting to go to the page and checking this page
        await calendarPage.checkCalendarPage();
        await calendarPage.checkUrl();
        //Checking role and school
        await Promise.all([calendarPage.checkRole(role), calendarPage.checkSchool(school)]);
    });

    test.after(async () => {
        await driver.quit()
    });
});