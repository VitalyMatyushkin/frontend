/**
 * Created by Vitaly on 01.06.17.
 */

const   {Builder, Capabilities} = require('selenium-webdriver'),
        test                    = require('selenium-webdriver/testing'),
        LoginPage               = require('../lib/LoginPage.js'),
        CalendarPage            = require('../lib/Pages/CalendarPage.js'),
	    Driver                  = require('./Driver.js');

const   timeout = 70000;

Promise.USE_PROMISE_MANAGER = false;

test.describe('User login with multiple roles', function(){
    this.timeout(timeout);
    let driver;
	const   email = 'reference@squadintouch.com',
		    pass = 'reference',
            userRoles = [   {roleName:'STUDENT', school:['Handcross Park School', 'Brave Owlets School', '11111']},
                            {roleName:'ADMIN', school:'Brave Owlets School'},
                            {roleName:'MANAGER', school:'Handcross Park School'},
                            {roleName:'PARENT', school:''},
                            {roleName:'COACH', school:'Great Walstead School'},
                            {roleName:'TEACHER', school:'Great Walstead School'}];

    test.before(async () => {
		driver = Driver.startDriver();
    });

    test.it('login', async () => {
        //login user
        let loginPage = new LoginPage(driver);
        await loginPage.visit();
        await loginPage.setEmail(email);
        await loginPage.setPass(pass);
        await loginPage.clickSubmit();
    });

    for (let role of userRoles) {
        test.it('Switch ' + role + ' role', async () => {
            let calendarPage = new CalendarPage(driver);
            await calendarPage.checkSelectRolePage();
            await calendarPage.switchRole(role.roleName);
            await calendarPage.checkCalendarPage();
            await calendarPage.findRole(role);
            await driver.navigate().back();
            await driver.navigate().refresh();
        });
    }

    test.after(async () => {
        await driver.quit()
    });
});
