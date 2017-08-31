/**
 * Created by Vitaly on 15.06.17.
 */

const   test                = require('selenium-webdriver/testing'),
        SchoolPage          = require('../../../lib/Pages/SchoolPages/SchoolPage.js'),
        OftenUsed           = require('../../../lib/OftenUsed.js'),
        EditSchoolSummary   = require('../../../lib/Pages/SchoolPages/EditSchoolSummaryTools.js'),
        Driver              = require('../../Driver.js'),
        Constants           = require('../../../lib/Constants.js');


const   timeout = 70000,
        // school = {
        //     filePathLogo: Constants.imagePath,
        //     schoolEmail: 'school@test.mail',
        //     departmentEmail: 'school@test.mail',
        //     name: 'New school',
        //     description: 'New description',
        //     phone: {prefix: '+7', number: '8005553535'},
        //     postcode: 'AB10 1AG',
        //     address: 'New address',
        //     domain: 'newdomain',
        //     siteAccess: 'Protected',
        //     password: 'password',
        //     studentRegistration: true
        // }
        school = {
            filePathLogo: Constants.imagePath,
            schoolEmail: 'fakegwabsent@greatwalstead.co.uk',
            departmentEmail: 'fakeadmin@greatwalstead.co.uk',
            name: 'Great Walstead School',
            description: 'alex@squadintouch.com',
            phone: {prefix: '+44', number: '1444483528'},
            postcode: 'AB10 1AG',
            address: 'East Mascalls Lane, Lindfield, West Sussex',
            domain: 'greatwalstead',
            siteAccess: 'Allowed',
            studentRegistration: false
        }
        ;

Promise.USE_PROMISE_MANAGER = false;

test.describe('Edit school', function(){
    this.timeout(timeout);
    let driver;
    const   email = 'reference@squadintouch.com',
            pass = 'reference',
            role = 'ADMIN';

    test.before(async () => {
        driver = Driver.startDriver();
        await  SchoolPage.loginAndSelectRole(driver, email, pass, role);
    });

    test.it('Edit school', async () => {
        let editSchoolSummary = new EditSchoolSummary(driver);
        await editSchoolSummary.visit();
        await editSchoolSummary.editClick();
        await editSchoolSummary.checkEditPage();
        // await editSchoolSummary.editImage(school.filePathLogo);
        await editSchoolSummary.editSchoolEmail(school.schoolEmail);
        await editSchoolSummary.editDepartmentEmail(school.departmentEmail);
        await editSchoolSummary.editName(school.name);
        await editSchoolSummary.editDescription(school.description);
        await editSchoolSummary.editPhone(school.phone);
        await editSchoolSummary.editPostcode(school.postcode);
        await editSchoolSummary.editAddress(school.address);
        await editSchoolSummary.editDomain(school.domain);
        await editSchoolSummary.editSiteAccess(school.siteAccess);
        // await editSchoolSummary.editPassword(school.password);
        await editSchoolSummary.editStudentRegistration(school.studentRegistration);
        await editSchoolSummary.submit();
    });

    test.after(async () => {
        await driver.quit()
    });
});

