/**
 * Created by Vitaly on 09.06.17.
 */
const   {By}         = require('selenium-webdriver'),
        OftenUsed    = require('../../OftenUsed'),
        Constants    = require('../../Constants.js'),
        SchoolPage   = require('./SchoolPage.js');

class FindFormTools{
    constructor(driver){
        this.driver = driver;
        this.urlForm = Constants.domain + '/#school_admin/forms';
        this.urlAddForm = Constants.domain + '/#school_admin/forms/add';
        this.filterButtonLocator = By.className('filter_btn');
        this.dataListItemLocator = By.className('eDataList_listItem');
        this.itemCellLocator = By.className('eDataList_listItemCell');
        this.inputTextLocator = By.css('div.eFilterContainer input');
        this.formLocator = By.className('bForm');
    }

    async visitFindPage(){
        await SchoolPage.visit(this.driver, this.urlForm);
        return await SchoolPage.checkPage(this.driver, this.filterButtonLocator);
    }

    async openFilter(){
        return SchoolPage.openFilterSearch(this.driver);
    }

    async setFormNameFind(formName){
        await SchoolPage.hoverAndSetTextInput(this.driver, 0, formName);
        return await SchoolPage.waitLoader(this.driver);
    }

    async visitAddFormPage(){
        await SchoolPage.visit(this.driver, this.urlAddForm);
		return await SchoolPage.checkPage(this.driver, this.formLocator);
    }

    async setFormName(formName){
        return await SchoolPage.setTextFieldInput(this.driver, 0, formName);
    }

    async setAgeGroup(ageGroup){
        return await SchoolPage.clickOptionSelect(this.driver, 1, ageGroup);
    }

    async editClick(resultLine){
        return await SchoolPage.clickEditInTable(this.driver, resultLine, 2)
    }

    async checkEditPage(){
        return await SchoolPage.checkPage(this.driver, this.formLocator);
    }

    async editFormName(formName){
        return await SchoolPage.editTextFieldInput(this.driver, 0, formName);
    }

    async submit(){
        return await SchoolPage.clickSubmitOnSavepanel(this.driver);
    }

    async checkResult(form){
        await this.driver.sleep(500);
        const items = await this.driver.findElements(this.dataListItemLocator);
        let result = 0;
        for (let i=1; i<items.length; ++i){
            const item = (await this.driver.findElements(this.dataListItemLocator))[i],
                    cellFormName = (await item.findElements(this.itemCellLocator))[0],
                    cellFormAgeGroup = (await item.findElements(this.itemCellLocator))[1],
                    nameCell = await cellFormName.getText(),
                    ageCell = await cellFormAgeGroup.getText();
            if (nameCell === form.formName && ageCell === form.ageGroup){
                result = i;
                break;
            }
        }
        return new Promise(
            (resolve, reject) => {
                if (result > 0){
                    resolve(result);
                } else {
                    reject(new Error('Form was not found'));
                }
            }
        );
    }

    async findForm(form){
        await this.visitFindPage();
        await this.openFilter();
        await this.setFormNameFind(form.formName);
        return Promise.resolve(true);
    }

}

module.exports = FindFormTools;
