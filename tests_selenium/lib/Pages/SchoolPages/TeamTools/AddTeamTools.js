/**
 * Created by Vitaly on 13.06.17.
 */
const   {By,until}  = require('selenium-webdriver'),
        OftenUsed   = require('../../../OftenUsed'),
        Constants   = require('../../../Constants.js'),
        SchoolPage  = require('../SchoolPage.js');

class AddTeamTools{
    constructor(driver){
        this.driver = driver;
        this.urlAddTeam = Constants.domain + '/#school_admin/teams/add';
        this.formFieldLocator = By.className('eManager_group');
        this.inputLocator = By.css('input');
        this.textareaLocator = By.className('mTextArea');
        this.inputDataLocator = By.className('eDateInput');
        this.optionLocator = By.tagName('option');
        this.selectLocator = By.className('eManager_select');
        this.dropdownLocator = By.className('bCombobox');
        this.dropdownListLocator = By.className('eCombobox_list');
        this.dropdownOptionLocator = By.className('eCombobox_option');
        this.selectPlayerLocator = By.className('eTeamWrapper_autocompleteWrapper');
        this.listPlayerLocator = By.className('eTeamWrapper_teamManagerWrapper');
        this.playerNameLocator = By.className('ePlayerChooser_playerName');
        this.checkBoxCaptainLocator = By.css('div.mCaptain input');
        this.checkBoxSubLocator = By.css('div.mSub input');
        this.addPlayersButtonLocator = By.className('ePlayerChooser_addToTeamButton');
        this.savePanelLocator = By.className('eForm_savePanel');
        this.buttonLocator = By.tagName('button');
        this.buttonSubmitLocator = By.className('bButton');
		this.agesButtonLocator = By.className('eCustomFont-plus');
		this.multiSelectDropdownLocator = By.className('bMultiSelectDropdown');
		this.multiSelectOptionLocator = By.className('eMultiSelectDropdown_item');
	}

    async visitAddTeamPage(){
        await SchoolPage.visit(this.driver, this.urlAddTeam);
		return await this.driver.wait(until.elementLocated(this.formFieldLocator), 5000);
	}

    async setName(name){
		const teamNameField = (await this.driver.findElements(this.formFieldLocator))[0];
        const teamNameInput = await teamNameField.findElement(this.inputLocator);
        await OftenUsed.characterByCharacter(this.driver,  teamNameInput, name);
        return Promise.resolve(true);
    }

    async setDescription(description){
        const descriptionField = (await this.driver.findElements(this.formFieldLocator))[1];
        const descriptionTextarea = await descriptionField.findElement(this.textareaLocator);
        await OftenUsed.characterByCharacter(this.driver,  descriptionTextarea, description);
        return Promise.resolve(true);
    }

    async setGender(gender){
        const genderField = (await this.driver.findElements(this.formFieldLocator))[3];
        await genderField.findElement(this.selectLocator).click();
        await this.driver.sleep(500);
        await SchoolPage.clickDropdownElem(genderField, gender, this.optionLocator);
        return Promise.resolve(true);
    }

    async setGame(game){
		await this.driver.sleep(500);
        const gameField = (await this.driver.findElements(this.formFieldLocator))[2];
        await gameField.findElement(this.selectLocator).click();
        await this.driver.sleep(500);
        await SchoolPage.clickDropdownElem(gameField, game, this.optionLocator);
        return Promise.resolve(true);
    }

    async setAges(ages){
		const agesButton = await this.driver.findElement(this.agesButtonLocator);
		await agesButton.click();
		await this.setOptionsMultiSelect(this.multiSelectDropdownLocator, ages);
		return await agesButton.click();
        return Promise.resolve(true);
    }

    async clickCheckboxFilterByHouse(){
            const checkHouseFilterField = (await this.driver.findElements(this.formFieldLocator))[5];
            return await checkHouseFilterField.findElement(this.inputLocator).click();
    }

    async filteredByHouse(house){
        if(house !== ''){
            await this.clickCheckboxFilterByHouse();
            await this.driver.wait(until.elementLocated(By.className('bCombobox  ')),10000);
            const selectHouseFilterField = (await this.driver.findElements(this.formFieldLocator))[6];
            const houseDropdown = await selectHouseFilterField.findElement(this.dropdownLocator);
            await houseDropdown.click();
            await this.driver.wait(until.elementIsVisible(await houseDropdown.findElement(this.dropdownListLocator)),10000);
            await SchoolPage.clickDropdownElem(houseDropdown, house, this.dropdownOptionLocator);
        }
    }

    async addPlayers(players){
		await this.driver.wait(until.elementLocated(this.selectPlayerLocator),10000);
		await this.driver.sleep(500);
        const selectPlayer = await this.driver.findElement(this.selectPlayerLocator);
        for (const player of players){
            await SchoolPage.clickDropdownElem(selectPlayer, player, this.playerNameLocator);
        }
        await selectPlayer.findElement(this.addPlayersButtonLocator).click();
        return Promise.resolve(true);
    }

    async checkCaptain(){
        const listPlayer = await this.driver.findElement(this.listPlayerLocator);
        await listPlayer.findElement(this.checkBoxCaptainLocator).click();
        await listPlayer.findElement(this.checkBoxSubLocator).click();

    }

    async submit(){
        const savePanel = await this.driver.findElement(this.savePanelLocator);
        const submitButton = await savePanel.findElement(this.buttonSubmitLocator);
        await submitButton.click();
        return Promise.resolve(true);
    }

	async setOptionsMultiSelect(wrapLocator, items){
		const fieldElem = await this.driver.findElement(wrapLocator);
		for (let itemName of items){
			await OftenUsed.clickSelectOption(fieldElem, this.multiSelectOptionLocator, itemName);
		}
		return Promise.resolve(true);
	}
}

module.exports = AddTeamTools;