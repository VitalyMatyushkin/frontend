/**
 * Created by Vitaly on 08.06.17.
 */
const   {By,until}  = require('selenium-webdriver'),
        OftenUsed   = require('../../../OftenUsed'),
        Constants   = require('../../../Constants.js'),
        SchoolPage  = require('../SchoolPage.js');

class AddStudentTools{
    constructor(driver){
        this.driver = driver;
        this.urlAddStudent = Constants.domain + '/#school_admin/students/add';
        this.formFieldLocator = By.className('eForm_field');
        this.inputLocator = By.css('div.eForm_fieldSet input');
        this.inputDataLocator = By.className('eDateInput');
        this.dropdownLocator = By.className('bCombobox');
        this.dropdownListLocator = By.className('eCombobox_list');
        this.dropdownOptionLocator = By.className('eCombobox_option');
        this.injuredCheckboxLocator = By.className('eCheckbox_switch');
        this.medicalInfoLocator = By.tagName('textarea');
        this.savePanelLocator = By.className('eForm_savePanel');
        this.buttonLocator = By.className('bButton');
        this.blockLocator = By.className('bFormBlock');
        this.phonePrefixSelectLocator = By.tagName('select');
        this.phonePrefixOptionLocator = By.tagName('option');
        this.nextKinLocator = By.id('add_new_kin');
        this.loaderLocator = By.className('eLoader_gif');
        this.loaderHideLocator = By.className('eLoader_gif mHidden');
    }

    async visitAddStudentPage(){
        return await SchoolPage.visit(this.driver, this.urlAddStudent);
    }

    async setImage(filePath){
        const imageField = await SchoolPage.getFieldElem(this.driver, 0, 0);
        const imageInput = await imageField.findElement(this.inputLocator);
        await imageInput.sendKeys(filePath);
        await this.driver.wait(until.elementLocated(this.loaderLocator), 10000);
        await this.driver.wait(until.elementLocated(this.loaderHideLocator), 10000);
        return Promise.resolve(true);
    }

    async setName(name){
        const nameField = await SchoolPage.getFieldElem(this.driver, 1, 0);
        const nameInput = await nameField.findElement(this.inputLocator);
        await OftenUsed.characterByCharacter(this.driver,  nameInput, name);
        return Promise.resolve(true);
    }

    async setSurname(surname){
        const surnameField = await SchoolPage.getFieldElem(this.driver, 2, 0);
        const surnameInput = await surnameField.findElement(this.inputLocator);
        await OftenUsed.characterByCharacter(this.driver,  surnameInput, surname);
        return Promise.resolve(true);
    }

    async setGender(gender){
        const genderField = await SchoolPage.getFieldElem(this.driver, 3, 0);
        const genderCheckbox = await genderField.findElement(By.css('[value="'+ gender +'"]'));
        await genderCheckbox.click();
        return Promise.resolve(true);
    }

    async setBirth(dateOfBirth){
        const dateOfBirthInput =await this.driver.findElement(this.inputDataLocator);
        // await OftenUsed.characterByCharacter(this.driver,  dateOfBirthInput, dateOfBirth);
        await dateOfBirthInput.sendKeys(dateOfBirth);
        return Promise.resolve(true);
    }

    async setForm(form){
        const formField = await SchoolPage.getFieldElem(this.driver, 5, 0);
        const formDropdown = await formField.findElement(this.dropdownLocator);
        await formDropdown.click();
        await this.driver.wait(until.elementIsVisible(await formDropdown.findElement(this.dropdownListLocator)),10000);
        await SchoolPage.clickDropdownElem(formDropdown, form, this.dropdownOptionLocator);
        return Promise.resolve(true);
    }

    async setHouse(house){
        const houseField = await SchoolPage.getFieldElem(this.driver, 6, 0);
        const houseDropdown = await houseField.findElement(this.dropdownLocator);
        await houseDropdown.click();
        await this.driver.wait(until.elementIsVisible(await houseDropdown.findElement(this.dropdownListLocator)),10000);
        await SchoolPage.clickDropdownElem(houseDropdown, house, this.dropdownOptionLocator);
        return Promise.resolve(true);
    }

    async setInjured(injured){
        const injuredChekbox =await this.driver.findElement(this.injuredCheckboxLocator);
        if (injured){
            await injuredChekbox.click();
        }
        return Promise.resolve(true);
    }

    async setMedicalInfo(info){
        const medicalInfoField = await SchoolPage.getFieldElem(this.driver, 8, 0);
        const medicalInfoTextarea = await medicalInfoField.findElement(this.medicalInfoLocator);
        await OftenUsed.characterByCharacter(this.driver,  medicalInfoTextarea, info);
        return Promise.resolve(true);
    }

    async submit(){
        const savePanel = await this.driver.findElement(this.savePanelLocator);
        const submitButton = (await savePanel.findElements(this.buttonLocator))[1];
        await submitButton.click();
        return Promise.resolve(true);
    }

    async setKinRelationship(relationship, indexBlock){
        const relationshipField = await SchoolPage.getFieldElemKin(this.driver, 0, 1, indexBlock);
        const relationshipInput = await relationshipField.findElement(this.inputLocator);
        await OftenUsed.characterByCharacter(this.driver,  relationshipInput, relationship);
        return Promise.resolve(true);
    }

    async setKinName(name, indexBlock){
        const nameField = await SchoolPage.getFieldElemKin(this.driver, 1, 1, indexBlock);
        const nameInput = await nameField.findElement(this.inputLocator);
        await OftenUsed.characterByCharacter(this.driver,  nameInput, name);
        return Promise.resolve(true);
    }

    async setKinSurname(surname, indexBlock){
        const surnameField = await SchoolPage.getFieldElemKin(this.driver, 2, 1, indexBlock);
        const surnameInput = await surnameField.findElement(this.inputLocator);
        await OftenUsed.characterByCharacter(this.driver,  surnameInput, surname);
        return Promise.resolve(true);
    }

    async setKinPhone(phone, indexBlock){
        const block = (await this.driver.findElements(this.blockLocator))[indexBlock];
        await block.findElement(this.phonePrefixSelectLocator).click();
        let prefix;
        if (phone.prefix === '+44'){
            prefix = (await block.findElements(this.phonePrefixOptionLocator))[0];
        } else {
            prefix = (await block.findElements(this.phonePrefixOptionLocator))[1];
        }
        await prefix.click();
        const phoneField = await SchoolPage.getFieldElemKin(this.driver, 3, 1, indexBlock);
        const phoneInput = await phoneField.findElement(this.inputLocator);
        await OftenUsed.characterByCharacter(this.driver,  phoneInput, phone.number);
        return Promise.resolve(true);
    }

    async setKinEmail(email, indexBlock){
        const emailField = await SchoolPage.getFieldElemKin(this.driver, 4, 1, indexBlock);
        const emailInput = await emailField.findElement(this.inputLocator);
        await OftenUsed.characterByCharacter(this.driver,  emailInput, email);
        return Promise.resolve(true);
    }

    async addNewKin(){
        const submitButton = await this.driver.findElement(this.nextKinLocator);
        await submitButton.click();
        return Promise.resolve(true);
    }
}

module.exports = AddStudentTools;