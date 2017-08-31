/**
 * Created by Vitaly on 07.06.17.
 */

const   {By}                = require('selenium-webdriver'),
        test                = require('selenium-webdriver/testing'),
        LoginPage           = require('../../lib/LoginPage.js'),
        CalendarPage        = require('../../lib/Pages/CalendarPage.js'),
        OftenUsed           = require('../../lib/OftenUsed.js'),
        Driver              = require('../Driver.js'),
        FixturesPage        = require('../../lib/Pages/FixturesPage.js'),
        AchievementsPage    = require('../../lib/Pages/AchievemetsPage.js'),
        MessagesPage        = require('../../lib/Pages/MessagesPage.js');

const   timeout             = 70000,
        selectRoleLocator   = By.className('bRoleSelector');

Promise.USE_PROMISE_MANAGER = false;

test.describe('Check all parent page', function(){
    this.timeout(timeout);
    let driver;
    const   email = 'reference@squadintouch.com',
            pass = 'reference',
            role = 'PARENT';

    test.before(async () => {
        driver = Driver.startDriver();
        //login user
        let loginPage = new LoginPage(driver);
        await loginPage.visit();
        await loginPage.setEmail(email);
        await loginPage.setPass(pass);
        await loginPage.clickSubmit();
    });

    test.it('Select student role', async () => {
        OftenUsed.checkPage(selectRoleLocator, driver);
		const calendarPage = new CalendarPage(driver);
        await calendarPage.switchRole(role);
    });

    test.it('Calendar page', async () => {
		const calendarPage = new CalendarPage(driver);
		await calendarPage.checkCalendarPage();
    });

    test.it('Fixtures page', async () => {
        await FixturesPage.checkAllPage(driver);
    });

    test.it('Achievements page', async () => {
        await AchievementsPage.checkAllPage(driver);
    });

    test.it('Messages page', async () => {
        await MessagesPage.checkAllPage(driver);
    });

    test.after(async () => {
        await driver.quit()
    });
});