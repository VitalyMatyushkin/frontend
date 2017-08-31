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
        },
        formEdit = {
            formName: 'EditForm',
            ageGroup: 'P2'
        };

Promise.USE_PROMISE_MANAGER = false;

test.describe('Edit form', function(){
    this.timeout(timeout);
    let driver;
    const   email = 'reference@squadintouch.com',
            pass = 'reference',
            role = 'ADMIN';

    test.before(async () => {
        driver = Driver.startDriver();
        await  SchoolPage.loginAndSelectRole(driver, email, pass, role);
    });

    test.it('Edit form', async () => {
        let toolsForm = new FormTools(driver);
        await toolsForm.findForm(form);
        let resultLine = await toolsForm.checkResult(form);

        await toolsForm.editClick(resultLine);
        await toolsForm.checkEditPage();
        await toolsForm.editFormName(formEdit.formName);
        await toolsForm.setAgeGroup(formEdit.ageGroup);
        await toolsForm.submit();

        await toolsForm.findForm(formEdit);
        await toolsForm.checkResult(formEdit);
    });

    test.after(async () => {
        await driver.quit()
    });
});
