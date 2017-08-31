/**
 * Created by Vitaly on 08.06.17.
 */
const   {By, until}  = require('selenium-webdriver'),
        OftenUsed    = require('../../../OftenUsed'),
        Constants    = require('../../../Constants.js'),
        SchoolPage   = require('../SchoolPage.js');

class FindStudentTools{
    constructor(driver){
        this.driver = driver;
        this.urlStudent = Constants.domain + '/#school_admin/students';
        this.filterButtonLocator = By.className('filter_btn');
        this.multiselectItemLocator = By.className('eMultiSelect_item');
        this.inputTextLocator = By.css('div.eFilterContainer input');
        this.dataListItemLocator = By.className('eDataList_listItem');
        this.itemCellLocator = By.className('eDataList_listItemCell');
        this.loaderLocator = By.className('eLoader');
    }

    async visitStudentPage(){
        await SchoolPage.visit(this.driver, this.urlStudent);
        return await SchoolPage.checkPage(this.driver, this.filterButtonLocator);
    }
    async openFilter(){
        const findButton = this.driver.findElement(this.filterButtonLocator);
        await findButton.click();
        return Promise.resolve(true);
    }

    async setGender(gender){
        const genderField = await SchoolPage.findAndHoverElem(this.driver, 0);
        let studGenderElem;
        if (gender === 'MALE'){
            studGenderElem = (await genderField.findElements(this.multiselectItemLocator))[0];
        } else {
            studGenderElem = (await genderField.findElements(this.multiselectItemLocator))[1];
        }
        await studGenderElem.click();
        return await SchoolPage.waitLoader(this.driver);
    }

    async setName(name){
        const nameField = await SchoolPage.findAndHoverElem(this.driver, 1);
        const input = await nameField.findElement(this.inputTextLocator);
        await input.clear();
        await OftenUsed.characterByCharacter(this.driver,  input, name);
        return await SchoolPage.waitLoader(this.driver);
    }

    async setSurname(surname){
        const surnameField = await SchoolPage.findAndHoverElem(this.driver, 2);
        const input = await surnameField.findElement(this.inputTextLocator);
        await input.clear();
        await OftenUsed.characterByCharacter(this.driver,  input, surname);
        return await SchoolPage.waitLoader(this.driver);
    }

    async setForms(forms){
        const formField = await SchoolPage.findAndHoverElem(this.driver, 3);
        await SchoolPage.markElemMultiselect(formField, forms);
        return await SchoolPage.waitLoader(this.driver);
    }

    async setHouses(houses){
        const houseField = await SchoolPage.findAndHoverElem(this.driver, 4);
        await SchoolPage.markElemMultiselect(houseField, houses);
        return await SchoolPage.waitLoader(this.driver);
    }

    async setBirthdayFrom(from){
        const birthdayField = await SchoolPage.findAndHoverElem(this.driver, 5);
        const fromInput = (await birthdayField.findElements(this.inputTextLocator))[0];
        await fromInput.clear();
        // await OftenUsed.characterByCharacter(this.driver,  fromInput, from);
        await fromInput.sendKeys(from);
        return Promise.resolve(true);
        // return await SchoolPage.waitLoader(this.driver);
    }

    async setBirthdayTo(to){
        const birthdayField = await SchoolPage.findAndHoverElem(this.driver, 5);
        const toInput = (await birthdayField.findElements(this.inputTextLocator))[1];
        await toInput.clear();
        // await OftenUsed.characterByCharacter(this.driver,  toInput, to);
        await toInput.sendKeys(to);
        return Promise.resolve(true);
        // return await SchoolPage.waitLoader(this.driver);
    }

    async checkResult(student){
        await this.driver.sleep(1000);
        const items = await this.driver.findElements(this.dataListItemLocator);
        let result = 0;
        for (let i=1; i<items.length; ++i){
            const item = (await this.driver.findElements(this.dataListItemLocator))[i];
            const itemCells = await item.findElements(this.itemCellLocator);
            const nameCell = await itemCells[1].getText();
            const surnameCell = await itemCells[2].getText();
            const formCell = await itemCells[3].getText();
            const houseCell = await itemCells[4].getText();
            const birthDayCell = await itemCells[5].getText();
            if (nameCell === student.name
                && (await SchoolPage.getGender(this.driver, i)) === student.gender
                && surnameCell === student.surname
                && formCell === student.form
                && houseCell === student.house
                && birthDayCell === student.birthday)
                {
                    result = i;
                    break;
                }
        }
        return new Promise(
            (resolve, reject) => {
                if (result > 0){
                    resolve(result);
                } else {
                    reject(new Error('Student was not found'));
                }
            }
        );
    }

    async findStudent(student){
        await this.visitStudentPage();
        await this.openFilter();
        await this.setGender(student.gender);
        await this.setName(student.name);
        await this.setSurname(student.surname);
        await this.setHouses(student.houses);
        await this.setForms(student.forms);
        await this.setBirthdayFrom(student.birthdayFrom);
        await this.setBirthdayTo(student.birthdayTo);

        return Promise.resolve(true);
    }

}

module.exports = FindStudentTools;
