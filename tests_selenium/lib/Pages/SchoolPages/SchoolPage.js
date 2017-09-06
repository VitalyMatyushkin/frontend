/**
 * Created by Vitaly on 07.06.17.
 */
const   {By, until}     = require('selenium-webdriver'),
        OftenUsed       = require('../../OftenUsed.js'),
        LoginPage       = require('../../../lib/LoginPage.js'),
        CalendarPage    = require('../../../lib/Pages/CalendarPage'),
        Constants       = require('../../Constants.js');

const   urlSchoolSummary        = Constants.domain + '/#school_admin/summary',
        urlSchoolStudents       = Constants.domain + '/#school_admin/students',
        urlSchoolForms          = Constants.domain + '/#school_admin/forms',
        urlSchoolHouses         = Constants.domain + '/#school_admin/houses',
        urlSchoolTeams          = Constants.domain + '/#school_admin/teams',
        urlSchoolNews           = Constants.domain + '/#school_admin/news',
        schoolTableLocator      = By.css('div.bSchoolMaster h1.eTitle'),
        urlSchoolGallery        = Constants.domain + '/#school_admin/gallery',
        schoolGalleryLocator    = By.css('div.bSchoolMaster h1.eSchoolMaster_title'),
        schoolSummaryLocator    = By.className('eSchoolMaster_summary'),
        schoolPageTables        = [ {url: urlSchoolStudents, text: 'Students'},
                                    {url: urlSchoolForms, text: 'Forms'},
                                    {url: urlSchoolHouses, text: 'Houses'},
                                    {url: urlSchoolTeams, text: 'Teams'},
                                    {url: urlSchoolNews, text: 'News'}],
        filterPanelLocator      = By.className('bFilterPanel'),
        filterFieldLocator      = By.className('bFilterField'),
        multiselectItemLocator  = By.className('eMultiSelect_item'),
        formLocator             = By.className('eForm_fieldColumn'),
        blockLocator            = By.className('bFormBlock'),
        formFieldLocator        = By.className('eForm_field'),
        dataListItemLocator     = By.className('eDataList_listItem'),
        iconSvgLocator          = By.css('svg.bIcon-gender use'),
        itemCellLocator         = By.className('eDataList_listItemCell'),
        inputLocator            = By.css('input'),
        dropdownLocator         = By.className('bCombobox'),
        dropdownOptionLocator   = By.className('eCombobox_option'),
        dropdownListLocator     = By.className('eCombobox_list'),
        savePanelLocator        = By.className('eForm_savePanel'),
        actionsLocator          = By.className('bLinkLike'),
        buttonLocator           = By.className('bButton'),
        filterButtonLocator     = By.className('filter_btn'),
        inputTextFilterLocator  = By.css('div.eFilterContainer input'),
        loaderLocator           = By.className('eLoader_gif'),
        loaderHideLocator       = By.className('eLoader_gif mHidden'),
        textareaLocator         = By.tagName('textarea'),
        loaderFindLocator       = By.className('eLoader');


class SchoolPage{
    /**
     * Navigate and check all pages in the submenu
     * @param driver
     * @param role
     * @returns {Promise.<boolean>}
     */
    static async checkAllPage(driver, role) {
        await driver.navigate().to(urlSchoolSummary);
        await OftenUsed.checkPage(schoolSummaryLocator, driver);

        for (let page of schoolPageTables) {
            await driver.navigate().to(page.url);
            await driver.sleep(500);
            await OftenUsed.checkPage(schoolTableLocator, driver);
            await OftenUsed.checkTextWebElem(driver, schoolTableLocator, page.text);
        }

        if (role === 'MANAGER' || role === 'ADMIN') {
            await driver.navigate().to(urlSchoolGallery);
            await OftenUsed.checkPage(schoolGalleryLocator, driver);
            await OftenUsed.checkTextWebElem(driver, schoolGalleryLocator, 'Gallery');
        }
        return Promise.resolve(true);
    }

    static async findAndHoverElem(driver, index){
        const filterPanel = await driver.findElement(filterPanelLocator);
        const fieldElem = (await filterPanel.findElements(filterFieldLocator))[index];
        await driver.actions().mouseMove(fieldElem).perform();
        return fieldElem;
    }

    static async getFieldElem(driver, indexField, indexForm){
        const form = (await driver.findElements(formLocator))[indexForm];
        const fieldElem = (await form.findElements(formFieldLocator))[indexField];
        return fieldElem;
    }

    static async getFieldElemKin(driver, indexField, indexForm, indexBlock){
        const form = (await driver.findElements(formLocator))[indexForm];
        const block = (await form.findElements(blockLocator))[indexBlock];
        const fieldElem = (await block.findElements(formFieldLocator))[indexField];
        return fieldElem;
    }

    static async markElemMultiselect(fieldElem, items){
        if (items === 'Select all'){
            await fieldElem.findElement(By.tagName('button')).click();
        } else {
            for (let itemName of items){
                await this.clickDropdownElem(fieldElem, itemName, multiselectItemLocator);
            }
        }
    }

    static async clickDropdownElem(fieldElem, itemName, locator){
        const itemOptions = await fieldElem.findElements(locator);
        for (let itemElem of itemOptions){
            if((await itemElem.getText()) === itemName){
                await itemElem.click();
                return Promise.resolve(true);
            }
        }
        return Promise.reject(new Error('Element was not found'));
    }

	static async clickOptionSelect(driver, indexField, textOption){
		const   field = (await driver.findElements(formFieldLocator))[indexField],
		        itemOptions = await field.findElements(By.tagName('option'));
		for (let itemElem of itemOptions){
			if((await itemElem.getText()) === textOption){
				await itemElem.click();
				return Promise.resolve(true);
			}
		}
		return Promise.reject(new Error('Element was not found'));
	}

    static async getLineResultTable(driver, indexLine){
        driver.sleep(500);
        const item = (await driver.findElements(dataListItemLocator))[indexLine];
        return await item.findElements(itemCellLocator);
    }

    static async getGender(driver, indexLine){
        let currentGender;
        const item = (await driver.findElements(dataListItemLocator))[indexLine];
        const genderLink = await item.findElement(iconSvgLocator).getAttribute('xlink:href');
        if (genderLink === '#icon_man'){
            currentGender = 'MALE';
        } else {
            if (genderLink === '#icon_woman'){
                currentGender = 'FEMALE';
            } else {
                currentGender = 'MIXED';
            }
        }
        return Promise.resolve(currentGender);
    }

    static async setTextFieldInput(driver, indexField, text){
        const field = (await driver.findElements(formFieldLocator))[indexField];
        const input = await field.findElement(inputLocator);
        return await OftenUsed.characterByCharacter(driver,  input, text);
    }

    static async setTextFieldTextarea(driver, indexField, text){
        const field = (await driver.findElements(formFieldLocator))[indexField];
        const textarea = await field.findElement(textareaLocator);
        return await OftenUsed.characterByCharacter(driver,  textarea, text);
    }

    static async editTextFieldInput(driver, indexField, text){
        const field = (await driver.findElements(formFieldLocator))[indexField];
        const input = await field.findElement(inputLocator);
        await OftenUsed.clearText(input);
        return await OftenUsed.characterByCharacter(driver,  input, text);
    }

    static async editTextFieldTextarea(driver, indexField, text){
        const field = (await driver.findElements(formFieldLocator))[indexField];
        const textarea = await field.findElement(textareaLocator);
        await OftenUsed.clearText(textarea);
        return await OftenUsed.characterByCharacter(driver,  textarea, text);
    }

    static async setOptionDropdown(driver, indexField, optionText){
        const field = (await driver.findElements(formFieldLocator))[indexField];
        const dropdown = await field.findElement(dropdownLocator);
        await dropdown.click();
        await driver.wait(until.elementIsVisible(await dropdown.findElement(dropdownListLocator)),10000);
        return await SchoolPage.clickDropdownElem(dropdown, optionText, dropdownOptionLocator);
    }

    static async clickSubmitOnSavepanel(driver){
        const savePanel = await driver.findElement(savePanelLocator);
        const submitButton = (await savePanel.findElements(buttonLocator))[1];
        return await submitButton.click();
    }

    static async visit(driver, url){
        return await driver.navigate().to(url);
    }

    static async clickEditInTable(driver, resultLine, indexColumn){
        const cellEdit = (await SchoolPage.getLineResultTable(driver, resultLine))[indexColumn];
        const edit = (await cellEdit.findElements(actionsLocator))[0];
        return await edit.click();
    }

    static async checkPage(driver, pageLocator){
        await driver.wait(until.elementLocated(pageLocator), 10000);
        await driver.sleep(500);
        return Promise.resolve(true);
    }

    static async openFilterSearch(driver){
        const findButton = driver.findElement(filterButtonLocator);
        return await findButton.click();
    }

    static async hoverAndSetTextInput(driver, indexField, text){
        const field = await this.findAndHoverElem(driver, indexField);
        const input = await field.findElement(inputTextFilterLocator);
        await OftenUsed.clearText(input);
        return await OftenUsed.characterByCharacter(driver,  input, text);
    }

    static async addNewImage(driver, indexField, filePath){
        const imageField = (await driver.findElements(formFieldLocator))[indexField];
        const imageInput = await imageField.findElement(inputLocator);
        await imageInput.sendKeys(filePath);
        await driver.wait(until.elementLocated(loaderLocator), 10000);
        await driver.wait(until.elementLocated(loaderHideLocator), 10000);
        return Promise.resolve(true);
    }

    static async loginAndSelectRole(driver, email, pass, role){
        const loginPage = new LoginPage(driver);
        const calendarPage = new CalendarPage(driver);
        await loginPage.login(email, pass);
        await calendarPage.checkSelectRolePage();
        await calendarPage.switchRole(role);
        return await calendarPage.checkCalendarPage();
    }

    /**
     * Wait until Loader appears and disappears
     * @param driver
     * @returns {Promise.<boolean>}
     */
    static async waitLoader(driver){
        const loader = await driver.findElement(loaderFindLocator);
        await driver.wait(until.elementIsVisible(loader),10000);
        await driver.wait(until.elementIsNotVisible(loader),10000);
        return Promise.resolve(true);
    }
}

module.exports = SchoolPage;