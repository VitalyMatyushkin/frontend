/**
 * Created by Vitaly on 08.06.17.
 */

const   test                = require('selenium-webdriver/testing'),
        SchoolPage          = require('../../../lib/Pages/SchoolPages/SchoolPage.js'),
        OftenUsed           = require('../../../lib/OftenUsed.js'),
        FindStudentTools    = require('../../../lib/Pages/SchoolPages/StudentTools/FindStudentTools.js'),
        Driver              = require('../../Driver.js');

const   timeout = 70000,
        student = {
            name: 'Lori',
            surname: 'Pfannerstill',
            gender: 'MALE',
            forms: 'Select all',
            houses: ['Grenfell'],
            birthdayFrom: '01011990',
            birthdayTo: '01012000'
        },
        studentResult = {
            name: 'Lori',
            surname: 'Pfannerstill',
            gender: 'MALE',
            form: '4A',
            house: 'Grenfell',
            birthday: '20 September 1993'
        };

Promise.USE_PROMISE_MANAGER = false;

test.describe('Add new student', function(){
    this.timeout(timeout);
    let driver;
    const   email = 'reference@squadintouch.com',
            pass = 'reference',
            role = 'ADMIN';

    test.before(async () => {
        driver = Driver.startDriver();
        await  SchoolPage.loginAndSelectRole(driver, email, pass, role);
    });

    test.it('Find student', async () => {
        let findStudent = new FindStudentTools(driver);
        await findStudent.visitStudentPage();
        await findStudent.openFilter();
        await findStudent.setGender(student.gender);
        await findStudent.setName(student.name);
        await findStudent.setSurname(student.surname);
        await findStudent.setForms(student.forms);
        await findStudent.setHouses(student.houses);
        await findStudent.setBirthdayFrom(student.birthdayFrom);
        await findStudent.setBirthdayTo(student.birthdayTo);
        await findStudent.checkResult(studentResult);
    });

    test.after(async () => {
        await driver.quit()
    });
});