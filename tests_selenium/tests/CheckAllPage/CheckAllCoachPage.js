/**
 * Created by Vitaly on 07.06.17.
 */

const   {By}            = require('selenium-webdriver'),
        test            = require('selenium-webdriver/testing'),
        LoginPage       = require('../../lib/LoginPage.js'),
        CalendarPage    = require('../../lib/Pages/CalendarPage.js'),
        OftenUsed       = require('../../lib/OftenUsed.js'),
        Driver          = require('../Driver.js'),
        SchoolPage      = require('../../lib/Pages/SchoolPages/SchoolPage.js'),
        InvitesPage     = require('../../lib/Pages/InvitesPage.js'),
        EventPage       = require('../../lib/Pages/EventPage.js'),
        ConsolePage     = require('../../lib/Pages/ConsolePage.js'),
        MessagesPage    = require('../../lib/Pages/MessagesPage.js');

const   timeout             = 70000,
        selectRoleLocator   = By.className('bRoleSelector');

Promise.USE_PROMISE_MANAGER = false;

test.describe('Check all coach page', function(){
    this.timeout(timeout);
    let driver;
    const   email = 'reference@squadintouch.com',
            pass = 'reference',
            role = 'COACH';

    test.before(async () => {
        driver = Driver.startDriver();
        //login user
        let loginPage = new LoginPage(driver);
        await loginPage.visit();
        await loginPage.setEmail(email);
        await loginPage.setPass(pass);
        await loginPage.clickSubmit();
    });

    test.it('Select admin role', async () => {
        OftenUsed.checkPage(selectRoleLocator, driver);
        let calendarPage = new CalendarPage(driver);
        await calendarPage.switchRole(role);
    });

    test.it('Event page', async () => {
        await EventPage.checkAllPage(driver);
    });

    test.it('School page', async () => {
        await SchoolPage.checkAllPage(driver, role);
    });

    test.it('Invites page', async () => {
        await InvitesPage.checkAllPage(driver);
    });

    test.it('Messages page', async () => {
        await MessagesPage.checkAllPage(driver);
    });

    test.after(async () => {
        await driver.quit()
    });
});