/**
 * Created by Vitaly on 12.06.17.
 */

const   {By, until}         = require('selenium-webdriver'),
        OftenUsed           = require('../../../OftenUsed'),
        SchoolPage          = require('../SchoolPage.js');

class EditStudentTools{
    constructor(driver){
        this.driver = driver;
        this.actionsLocator = By.className('bLinkLike');
        this.studentFormLocator = By.className('eStudentForm');
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
        this.dropdownInputLocator = By.className('eCombobox_input ');
        this.loaderLocator = By.className('eLoader_gif');
        this.loaderHideLocator = By.className('eLoader_gif mHidden');
    }

    async editClick(resultLine){
        const cellEdit = (await SchoolPage.getLineResultTable(this.driver, resultLine))[7];
        const edit = (await cellEdit.findElements(this.actionsLocator))[0];
        await edit.click();
    }

    async checkEditPage(){
        await this.driver.wait(until.elementLocated(this.studentFormLocator), 20000);
        await this.driver.sleep(1000);
        return Promise.resolve(true);
    }

    async editImage(filePath){
        const imageField = await SchoolPage.getFieldElem(this.driver, 0, 0);
        const imageInput = await imageField.findElement(this.inputLocator);
        await imageInput.sendKeys(filePath);
        await this.driver.wait(until.elementLocated(this.loaderLocator), 20000);
        await this.driver.wait(until.elementLocated(this.loaderHideLocator), 20000);
        return Promise.resolve(true);
    }

    async editName(name){
        const nameField = await SchoolPage.getFieldElem(this.driver, 1, 0);
        const nameInput = await nameField.findElement(this.inputLocator);
        await nameInput.clear();
        await OftenUsed.characterByCharacter(this.driver,  nameInput, name);
        return Promise.resolve(true);
    }

    async editSurname(surname){
        const surnameField = await SchoolPage.getFieldElem(this.driver, 2, 0);
        const surnameInput = await surnameField.findElement(this.inputLocator);
        await surnameInput.clear();
        await OftenUsed.characterByCharacter(this.driver,  surnameInput, surname);
        return Promise.resolve(true);
    }

    async editGender(gender){
        const genderField = await SchoolPage.getFieldElem(this.driver, 3, 0);
        const genderCheckbox = await genderField.findElement(By.css('[value="'+ gender +'"]'));
        await genderCheckbox.click();
        return Promise.resolve(true);
    }

    async editBirthDay(dateOfBirth){
        const dateOfBirthInput =await this.driver.findElement(this.inputDataLocator);
        await dateOfBirthInput.clear();
        // await OftenUsed.characterByCharacter(this.driver,  dateOfBirthInput, dateOfBirth);
        await dateOfBirthInput.sendKeys(dateOfBirth);
        return Promise.resolve(true);
    }

    async editForm(form){
        const formField = await SchoolPage.getFieldElem(this.driver, 5, 0);
        const formDropdown = await formField.findElement(this.dropdownLocator);
        const inputDropdown = await formDropdown.findElement(this.dropdownInputLocator);
        await OftenUsed.clearText(inputDropdown);
        await formDropdown.click();
        await this.driver.wait(until.elementIsVisible(await formDropdown.findElement(this.dropdownListLocator)),20000);
        await SchoolPage.clickDropdownElem(formDropdown, form, this.dropdownOptionLocator);
        return Promise.resolve(true);
    }

    async editHouse(house){
        const houseField = await SchoolPage.getFieldElem(this.driver, 6, 0);
        const houseDropdown = await houseField.findElement(this.dropdownLocator);
        const inputDropdown = await houseDropdown.findElement(this.dropdownInputLocator);
        await OftenUsed.clearText(inputDropdown);
        await houseDropdown.click();
        await this.driver.wait(until.elementIsVisible(await houseDropdown.findElement(this.dropdownListLocator)),20000);
        await SchoolPage.clickDropdownElem(houseDropdown, house, this.dropdownOptionLocator);
        return Promise.resolve(true);
    }

    async editInjured(injured){
        const injuredChekbox =await this.driver.findElement(this.injuredCheckboxLocator);
        if (injured){
            await injuredChekbox.click();
        }
        return Promise.resolve(true);
    }

    async editMedicalInfo(info){
        const medicalInfoField = await SchoolPage.getFieldElem(this.driver, 8, 0);
        const medicalInfoTextarea = await medicalInfoField.findElement(this.medicalInfoLocator);
        await OftenUsed.clearText(medicalInfoTextarea);
        await OftenUsed.characterByCharacter(this.driver,  medicalInfoTextarea, info);
        return Promise.resolve(true);
    }

    async submit(){
        const savePanel = await this.driver.findElement(this.savePanelLocator);
        const submitButton = (await savePanel.findElements(this.buttonLocator))[1];
        await submitButton.click();
        return Promise.resolve(true);
    }

    async editKinRelationship(relationship, indexBlock){
        const relationshipField = await SchoolPage.getFieldElemKin(this.driver, 0, 1, indexBlock);
        const relationshipInput = await relationshipField.findElement(this.inputLocator);
        await relationshipInput.clear();
        await OftenUsed.characterByCharacter(this.driver,  relationshipInput, relationship);
        return Promise.resolve(true);
    }

    async editKinName(name, indexBlock){
        const nameField = await SchoolPage.getFieldElemKin(this.driver, 1, 1, indexBlock);
        const nameInput = await nameField.findElement(this.inputLocator);
        await nameInput.clear();
        await OftenUsed.characterByCharacter(this.driver,  nameInput, name);
        return Promise.resolve(true);
    }

    async editKinSurname(surname, indexBlock){
        const surnameField = await SchoolPage.getFieldElemKin(this.driver, 2, 1, indexBlock);
        const surnameInput = await surnameField.findElement(this.inputLocator);
        await surnameInput.clear();
        await OftenUsed.characterByCharacter(this.driver,  surnameInput, surname);
        return Promise.resolve(true);
    }

    async editKinPhone(phone, indexBlock){
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
        await phoneInput.clear();
        await OftenUsed.characterByCharacter(this.driver,  phoneInput, phone.number);
        return Promise.resolve(true);
    }

    async editKinEmail(email, indexBlock){
        const emailField = await SchoolPage.getFieldElemKin(this.driver, 4, 1, indexBlock);
        const emailInput = await emailField.findElement(this.inputLocator);
        await emailInput.clear();
        await OftenUsed.characterByCharacter(this.driver,  emailInput, email);
        return Promise.resolve(true);
    }
}

module.exports = EditStudentTools;
