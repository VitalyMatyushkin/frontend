/**
 * Created by Vitaly on 12.06.17.
 */

const   test                = require('selenium-webdriver/testing'),
        SchoolPage          = require('../../../lib/Pages/SchoolPages/SchoolPage.js'),
        OftenUsed           = require('../../../lib/OftenUsed.js'),
        FindStudentTools    = require('../../../lib/Pages/SchoolPages/StudentTools/FindStudentTools.js'),
        EditStudentTools    = require('../../../lib/Pages/SchoolPages/StudentTools/EditStudentTools.js'),
        Driver              = require('../../Driver.js'),
        Constants           = require('../../../lib/Constants.js');


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
            gender: 'MALE',
            name: 'Lori',
            surname: 'Pfannerstill',
            form: '4A',
            house: 'Grenfell',
            birthday: '20 September 1993'
        },
        studentEdit = {
            filePath: Constants.imagePath,
            name: 'Lori',
            surname: 'Pfannerstill',
            gender: 'MALE',
            dateOfBirth: '20091993',
            form: '4A',
            house: 'Grenfell',
            injured: false,
            medicalInfo: 'TestText'
        },
        studentFind = {
            name: 'Lori',
            surname: 'Pfannerstill',
            gender: 'MALE',
            forms: 'Select all',
            houses: ['Grenfell'],
            birthdayFrom: '01011990',
            birthdayTo: '01012000'
        },
        studentEditResult = {
            gender: 'MALE',
            name: 'Lori',
            surname: 'Pfannerstill',
            form: '4A',
            house: 'Grenfell',
            birthday: '20 September 1993'
        },
        editKin = [{
                relationship: 'motherEdit',
                name: 'TestMumNameEdit',
                surname: 'TestMumSurnameEdit',
                phone: {prefix: '+7', number: '8005553535'},
                email: 'test@test.test'
            }];

Promise.USE_PROMISE_MANAGER = false;

test.describe('Edit student', function(){
    this.timeout(timeout);
    let driver;
    const   email = 'reference@squadintouch.com',
            pass = 'reference',
            role = 'ADMIN';

    test.before(async () => {
        driver = Driver.startDriver();
        await  SchoolPage.loginAndSelectRole(driver, email, pass, role);
    });

    test.it('Find and edit student', async () => {
        let findStudent = new FindStudentTools(driver);
        await findStudent.findStudent(student);
        let resultLine = await findStudent.checkResult(studentResult);

        let editStudent = new EditStudentTools(driver);
        await editStudent.editClick(resultLine);
        await editStudent.checkEditPage();
        await editStudent.editImage(studentEdit.filePath);
        await editStudent.editName(studentEdit.name);
        await editStudent.editSurname(studentEdit.surname);
        await editStudent.editGender(studentEdit.gender);
        await editStudent.editBirthDay(studentEdit.dateOfBirth);
        await editStudent.editForm(studentEdit.form);
        await editStudent.editHouse(studentEdit.house);
        await editStudent.editInjured(studentEdit.injured);
        await editStudent.editMedicalInfo(studentEdit.medicalInfo);

        for (let i in editKin) {
            await editStudent.editKinRelationship(editKin[i].relationship, i);
            await editStudent.editKinName(editKin[i].name, i);
            await editStudent.editKinSurname(editKin[i].surname, i);
            await editStudent.editKinPhone(editKin[i].phone, i);
            await editStudent.editKinEmail(editKin[i].email, i);
        }

        await editStudent.submit();


        await findStudent.findStudent(studentFind);
        await findStudent.checkResult(studentEditResult);
    });

    test.after(async () => {
        await driver.quit()
    });
});
