/**
 * Created by Vitaly on 01.06.17.
 */

const   {Builder, Capabilities} = require('selenium-webdriver'),
        test                    = require('selenium-webdriver/testing'),
        LoginPage               = require('../lib/LoginPage.js'),
        CalendarPage            = require('../lib/Pages/CalendarPage.js'),
	    Driver                  = require('./Driver.js');

const   timeout = 100000;

Promise.USE_PROMISE_MANAGER = false;

describe('Role switching test', function() {
    this.timeout(timeout);
    let driver;
    const   email = 'newell@steam.com',
            pass = 'Newell2017',
            availableItem = [
                    {roleName: 'admin', school: 'Great Walstead School'},
                    {roleName: 'coach', school: 'Abberley Hall School'},
                    {roleName: 'student', school: ''},
                    {roleName: 'parent', school: ''}
            ];

    test.before(async () => {
		driver = Driver.startDriver();
    });

    test.it('Login and navigate to page with dropdown', async () => {
        let loginPage = new LoginPage(driver);
        let calendarPage = new CalendarPage(driver);
        await loginPage.visit();
        await loginPage.setEmail(email);
        await loginPage.setPass(pass);
        await loginPage.clickSubmit();
        await calendarPage.checkSelectRolePage();
        await calendarPage.switchRole('STUDENT');
        await calendarPage.checkCalendarPage();
    });

    for(let i in availableItem) {
        test.it('Test role switching', async () => {
            let calendarPage = new CalendarPage(driver);
            await calendarPage.openDropdown();
            let webElem = (await calendarPage.getDropdownItems())[i];
            await calendarPage.checkItem(webElem, availableItem[i]);
        });
    }

    test.after(async () => {
        await driver.quit()
    });
});

