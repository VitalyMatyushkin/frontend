/**
 * Created by Vitaly on 08.06.17.
 */

const   test                = require('selenium-webdriver/testing'),
        SchoolPage          = require('../../../lib/Pages/SchoolPages/SchoolPage.js'),
        OftenUsed           = require('../../../lib/OftenUsed.js'),
        AddStudentTools     = require('../../../lib/Pages/SchoolPages/StudentTools/AddStudentTools.js'),
        FindStudentTools    = require('../../../lib/Pages/SchoolPages/StudentTools/FindStudentTools.js'),
        Driver              = require('../../Driver.js'),
        Constants           = require('../../../lib/Constants.js');


const   timeout = 70000,
        student = {
            filePath: Constants.imagePath,
            name: 'TestStudentName',
            surname: 'TestStudentSurname',
            gender: 'MALE',
            dateOfBirth: '01012000',
            form: '4A',
            house: 'House',
            injured: true,
            medicalInfo: 'TestText'
        },
        studentFind = {
            name: 'TestStudentName',
            surname: 'TestStudentSurname',
            gender: 'MALE',
            forms: 'Select all',
            houses: ['House'],
            birthdayFrom: '01011990',
            birthdayTo: '01012000'
        },
        studentResult = {
            gender: 'MALE',
            name: 'TestStudentName',
            surname: 'TestStudentSurname',
            form: '4A',
            house: 'House',
            birthday: '01 January 2000'
        },
        nextOfKin = [{
                relationship: 'mother',
                name: 'TestMumName',
                surname: 'TestMumSurname',
                phone: {prefix: '+7', number: '8005553535'},
                email: 'test@test.test'
            },
            {
                relationship: 'father',
                name: 'TestDadName',
                surname: 'TestDadSurname',
                phone: {prefix: '+7', number: '8005553535'},
                email: 'test@test.test'
            }];

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

    test.it('Add student', async () => {
        let addStudent = new AddStudentTools(driver);
        await addStudent.visitAddStudentPage();
        await addStudent.setImage(student.filePath);
        await addStudent.setName(student.name);
        await addStudent.setSurname(student.surname);
        await addStudent.setGender(student.gender);
        await addStudent.setBirth(student.dateOfBirth);
        await addStudent.setForm(student.form);
        await addStudent.setHouse(student.house);
        await addStudent.setInjured(student.injured);
        await addStudent.setMedicalInfo(student.medicalInfo);

        for (let i in nextOfKin) {
            await addStudent.setKinRelationship(nextOfKin[i].relationship, i);
            await addStudent.setKinName(nextOfKin[i].name, i);
            await addStudent.setKinSurname(nextOfKin[i].surname, i);
            await addStudent.setKinPhone(nextOfKin[i].phone, i);
            await addStudent.setKinEmail(nextOfKin[i].email, i);
            await addStudent.addNewKin();
        }
        await addStudent.submit();

        let findStudent = new FindStudentTools(driver);
        await findStudent.findStudent(studentFind);
        await findStudent.checkResult(studentResult);
    });

    test.after(async () => {
        await driver.quit()
    });
});

