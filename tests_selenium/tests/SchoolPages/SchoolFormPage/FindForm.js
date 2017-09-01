/**
 * Created by Vitaly on 09.06.17.
 */

const   test                = require('selenium-webdriver/testing'),
        SchoolPage          = require('../../../lib/Pages/SchoolPages/SchoolPage.js'),
        OftenUsed           = require('../../../lib/OftenUsed.js'),
        FormTools           = require('../../../lib/Pages/SchoolPages/FormTools.js'),
        Driver              = require('../../Driver.js');

const   timeout = 70000,
        form = {
            formName: 'EditForm',
            ageGroup: 'P2'
        };

Promise.USE_PROMISE_MANAGER = false;

test.describe('Find form', function(){
    this.timeout(timeout);
    let driver;
    const   email = 'reference@squadintouch.com',
            pass = 'reference',
            role = 'ADMIN';

    test.before(async () => {
        driver = Driver.startDriver();
        await  SchoolPage.loginAndSelectRole(driver, email, pass, role);
    });

    test.it('Find form', async () => {
        let toolsForm = new FormTools(driver);
        await toolsForm.visitFindPage();
        await toolsForm.openFilter();
        await toolsForm.setFormNameFind(form.formName);
        await toolsForm.checkResult(form);
    });

    test.after(async () => {
        await driver.quit()
    });
});
