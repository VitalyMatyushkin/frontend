/**
 * Created by Vitaly on 08.06.17.
 */

const   test                = require('selenium-webdriver/testing'),
        SchoolPage          = require('../../../lib/Pages/SchoolPages/SchoolPage.js'),
        OftenUsed           = require('../../../lib/OftenUsed.js'),
        FormTools           = require('../../../lib/Pages/SchoolPages/FormTools.js'),
        Driver              = require('../../Driver.js');

const   timeout = 70000,
        form = {
            formName: 'NewForm',
            ageGroup: 'P2'
        };

Promise.USE_PROMISE_MANAGER = false;

test.describe('Add new form', function(){
    this.timeout(timeout);
    let driver;
    const   email = 'reference@squadintouch.com',
            pass = 'reference',
            role = 'ADMIN';

    test.before(async () => {
        driver = Driver.startDriver();
        await  SchoolPage.loginAndSelectRole(driver, email, pass, role);
    });

    test.it('Add form', async () => {
        let formTools = new FormTools(driver);
        await formTools.visitAddFormPage();
        await formTools.setFormName(form.formName);
        await formTools.setAgeGroup(form.ageGroup);
        await formTools.submit();

        await formTools.findForm(form);
        await formTools.checkResult(form);
    });

    test.after(async () => {
        await driver.quit()
    });
});

