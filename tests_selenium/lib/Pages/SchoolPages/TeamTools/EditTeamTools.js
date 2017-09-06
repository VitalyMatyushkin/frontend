/**
 * Created by Vitaly on 14.06.17.
 */
const   {By,until}  = require('selenium-webdriver'),
        OftenUsed   = require('../../../OftenUsed'),
        Constants   = require('../../../Constants.js'),
        SchoolPage  = require('../SchoolPage.js');

class EditTeamTools{
    constructor(driver){
        this.driver = driver;
        this.urlAddTeam = Constants.domain + '/#school_admin/teams/add';
        this.actionsLocator = By.className('bLinkLike');
        this.formLocator = By.className('mTeamForm');
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
        this.addPlayersButtonLocator = By.id('addPlayer_button');
        this.removePlayersButtonLocator = By.className('eTeam_removeButton');
        this.savePanelLocator = By.className('eForm_savePanel');
        this.buttonLocator = By.tagName('button');
        this.managerPlayerItemLocator = By.className('eTeam_playerItem');
        this.managerPlayerLocator = By.css('div.eTeam_playerList div.eTeam_player');
        this.buttonSubmitLocator = By.className('bButton');
		this.agesButtonLocator = By.className('eCustomFont-plus');
		this.multiSelectDropdownLocator = By.className('bMultiSelectDropdown');
		this.multiSelectOptionLocator = By.className('eMultiSelectDropdown_item');
		this.crossAgeLocator = By.css('div.eMultiSelectDropdown_input div.eInputItem_cross');
    }

    async editClick(resultLine){
        return await SchoolPage.clickEditInTable(this.driver, resultLine, 6);
    }

    async checkEditPage(){
        await SchoolPage.checkPage(this.driver, this.formLocator);
        await this.driver.wait(until.elementLocated(this.listPlayerLocator),10000);
        await this.driver.wait(until.elementIsVisible(await this.driver.findElement(this.listPlayerLocator)),10000);
        return Promise.resolve(true);
    }

    async editName(name){
        const teamNameField = (await this.driver.findElements(this.formFieldLocator))[0];
        const teamNameInput = await teamNameField.findElement(this.inputLocator);
        await OftenUsed.clearText(teamNameInput);
        await OftenUsed.characterByCharacter(this.driver,  teamNameInput, name);
        return Promise.resolve(true);
    }

    async editDescription(description){
        const descriptionField = (await this.driver.findElements(this.formFieldLocator))[1];
        const descriptionTextarea = await descriptionField.findElement(this.textareaLocator);
        await OftenUsed.clearText(descriptionTextarea);
        await OftenUsed.characterByCharacter(this.driver,  descriptionTextarea, description);
        return Promise.resolve(true);
    }

    async editGender(gender){
        const genderField = (await this.driver.findElements(this.formFieldLocator))[3];
        await genderField.findElement(this.selectLocator).click();
        await this.driver.sleep(500);
        await SchoolPage.clickDropdownElem(genderField, gender, this.optionLocator);
        return Promise.resolve(true);
    }

    async editGame(game){
		await this.driver.sleep(500);
        const gameField = (await this.driver.findElements(this.formFieldLocator))[2];
        await gameField.findElement(this.selectLocator).click();
        await this.driver.sleep(500);
        await SchoolPage.clickDropdownElem(gameField, game, this.optionLocator);
        return Promise.resolve(true);
    }

    async editAges(ages){
		const   crossButton = await this.driver.findElements(this.crossAgeLocator),
		        agesButton = await this.driver.findElement(this.agesButtonLocator);
		for (let cross of crossButton){
		    await cross.click();
        }
		await agesButton.click();
		await this.setOptionsMultiSelect(this.multiSelectDropdownLocator, ages);
		return await agesButton.click();
		return Promise.resolve(true);
    }

    async clickCheckboxFilterByHouse(){
        const   checkHouseFilterField = (await this.driver.findElements(this.formFieldLocator))[5],
                checkBoxHouseFilter = await checkHouseFilterField.findElement(this.inputLocator),
                value = await checkBoxHouseFilter.getAttribute('value');
        if (value !== 'on') {
			await checkBoxHouseFilter.click();
        }
        return Promise.resolve(true);
    }

    async editFilteredByHouse(house){
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
        await this.driver.wait(until.elementLocated(By.className('ePlayerChooser_playerList')),10000);
        await this.driver.sleep(500);
        const selectPlayer = await this.driver.findElement(this.selectPlayerLocator);
        for (let player of players){
            await SchoolPage.clickDropdownElem(selectPlayer, player, this.playerNameLocator);
        }
        const addButton = await selectPlayer.findElement(this.addPlayersButtonLocator);
        await addButton.click();
        return Promise.resolve(true);
    }

    async deletePlayers(players){
        await this.driver.wait(until.elementLocated(this.managerPlayerLocator),10000);
        await this.driver.sleep(500);
        const listPlayer = await this.driver.findElement(this.listPlayerLocator);
        for (const player of players){
            await SchoolPage.clickDropdownElem(listPlayer, player, this.managerPlayerItemLocator);
        }
        await listPlayer.findElement(this.removePlayersButtonLocator).click();
        return Promise.resolve(true);
    }

    async checkCaptain(){
        const listPlayer = await this.driver.findElement(this.listPlayerLocator);
        await listPlayer.findElement(this.checkBoxCaptainLocator).click();
        return Promise.resolve(true);
    }

    async checkSub(){
        const listPlayer = await this.driver.findElement(this.listPlayerLocator);
        await listPlayer.findElement(this.checkBoxSubLocator).click();
        return Promise.resolve(true);
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

module.exports = EditTeamTools;