/**
 * Created by Vitaly on 15.06.17.
 */

const   {By, until}         = require('selenium-webdriver'),
        OftenUsed           = require('../../OftenUsed'),
        Constants           = require('../../Constants.js'),
        SchoolPage          = require('./SchoolPage.js');

class EditSchoolSummaryTools{
    constructor(driver){
        this.driver = driver;
        this.urlSchool = Constants.domain + '/#school_admin/summary';
        this.editSchoolLocator = By.css('div.eSchoolMaster_summary_buttons div.bButton');
        this.editScoolPageLocator = By.className('bSchoolEdit');
        this.inputLocator = By.css('div.eForm_fieldSet input');
        this.textareaLocator = By.css('div.eForm_fieldSet textarea');
        this.loaderLocator = By.className('eLoader_gif');
        this.loaderHideLocator = By.className('eLoader_gif mHidden');
        this.selectLocator = By.tagName('select');
        this.optionLocator = By.tagName('option');
        this.dropdownLocator = By.className('bCombobox');
        this.dropdownListLocator = By.className('eCombobox_list');
        this.dropdownOptionLocator = By.className('eCombobox_option');
        this.dropdownInputLocator = By.className('eCombobox_input ');
        this.checkboxLocator = By.css('div.bCheckbox input.eCheckbox_switch');
        this.savePanelLocator = By.className('eForm_savePanel');
        this.buttonLocator = By.className('bButton');
    }

    async visit(){
        await this.driver.navigate().to(this.urlSchool);
        return Promise.resolve(true);
    }

    async editClick(){
        await this.driver.wait(until.elementLocated(this.editSchoolLocator), 10000);
        const edit = await this.driver.findElement(this.editSchoolLocator);
        await edit.click();
    }

    async checkEditPage(){
        await this.driver.wait(until.elementLocated(this.editScoolPageLocator), 10000);
        await this.driver.sleep(500);
        return Promise.resolve(true);
    }

    async editImage(filePath){
        const imageField = await SchoolPage.getFieldElem(this.driver, 0, 0);
        const imageInput = await imageField.findElement(this.inputLocator);
        await imageInput.sendKeys(filePath);
        await this.driver.wait(until.elementLocated(this.loaderLocator), 10000);
        await this.driver.wait(until.elementLocated(this.loaderHideLocator), 10000);
        return Promise.resolve(true);
    }

    async editSchoolEmail(email){
        const emailField = await SchoolPage.getFieldElem(this.driver, 1, 0);
        const emailInput = await emailField.findElement(this.inputLocator);
        await emailInput.clear();
        await OftenUsed.characterByCharacter(this.driver,  emailInput, email);
        return Promise.resolve(true);
    }

    async editDepartmentEmail(email){
        const emailField = await SchoolPage.getFieldElem(this.driver, 2, 0);
        const emailInput = await emailField.findElement(this.inputLocator);
        await emailInput.clear();
        await OftenUsed.characterByCharacter(this.driver,  emailInput, email);
        return Promise.resolve(true);
    }

    async editName(name){
        const nameField = await SchoolPage.getFieldElem(this.driver, 0, 1);
        const nameInput = await nameField.findElement(this.inputLocator);
        await nameInput.clear();
        await OftenUsed.characterByCharacter(this.driver,  nameInput, name);
        return Promise.resolve(true);
    }

    async editDescription(description){
        const descriptionField = await SchoolPage.getFieldElem(this.driver, 1, 1);
        const descriptionTextarea = await descriptionField.findElement(this.textareaLocator);
        await descriptionTextarea.clear();
        await OftenUsed.characterByCharacter(this.driver,  descriptionTextarea, description);
        return Promise.resolve(true);
    }

    async editPhone(phone){
        const phoneField = await SchoolPage.getFieldElem(this.driver, 2, 1);
        await phoneField.findElement(this.selectLocator).click();
        let prefix;
        if (phone.prefix === '+44'){
            prefix = (await phoneField.findElements(this.optionLocator))[0];
        } else {
            prefix = (await phoneField.findElements(this.optionLocator))[1];
        }
        await prefix.click();
        const phoneInput = await phoneField.findElement(this.inputLocator);
        await phoneInput.clear();
        await OftenUsed.characterByCharacter(this.driver,  phoneInput, phone.number);
        return Promise.resolve(true);
    }

    async editPostcode(postcode){
        const postcodeField = await SchoolPage.getFieldElem(this.driver, 3, 1);
        const postcodeDropdown = await postcodeField.findElement(this.dropdownLocator);
        const inputDropdown = await postcodeDropdown.findElement(this.dropdownInputLocator);
        await OftenUsed.clearText(inputDropdown);
        await postcodeDropdown.click();
        await this.driver.wait(until.elementIsVisible(await postcodeDropdown.findElement(this.dropdownListLocator)),10000);
        await SchoolPage.clickDropdownElem(postcodeDropdown, postcode, this.dropdownOptionLocator);
        return Promise.resolve(true);
    }

    async editAddress(address){
        const addressField = await SchoolPage.getFieldElem(this.driver, 4, 1);
        const addressInput = await addressField.findElement(this.inputLocator);
        await addressInput.clear();
        await OftenUsed.characterByCharacter(this.driver,  addressInput, address);
        return Promise.resolve(true);
    }

    async editDomain(domain){
        const domainField = await SchoolPage.getFieldElem(this.driver, 5, 1);
        const domainInput = await domainField.findElement(this.inputLocator);
        await domainInput.clear();
        await OftenUsed.characterByCharacter(this.driver,  domainInput, domain);
        return Promise.resolve(true);
    }

    async editSiteAccess(siteAccess){
        const siteAccessField = await SchoolPage.getFieldElem(this.driver, 6, 1);
        const siteAccessDropdown = await siteAccessField.findElement(this.selectLocator);
        await siteAccessDropdown.click();
        await SchoolPage.clickDropdownElem(siteAccessDropdown, siteAccess, this.optionLocator);
        return Promise.resolve(true);
    }

    async editPassword(password){
        const passwordField = await SchoolPage.getFieldElem(this.driver, 7, 1);
        const passwordInput = await passwordField.findElement(this.inputLocator);
        await passwordInput.clear();
        await OftenUsed.characterByCharacter(this.driver,  passwordInput, password);
        return Promise.resolve(true);
    }

    async editStudentRegistration(check){
        const checkStudentRegistration = await this.driver.findElement(this.checkboxLocator);
        if (check === true){
            await checkStudentRegistration.click();
        }
        return Promise.resolve(true);
    }

    async submit(){
        const savePanel = await this.driver.findElement(this.savePanelLocator);
        const submitButton = (await savePanel.findElements(this.buttonLocator))[1];
        await submitButton.click();
        return Promise.resolve(true);
    }
}

module.exports = EditSchoolSummaryTools;
