/**
 * Created by Vitaly on 22.06.17.
 */

const   {By, until}     = require('selenium-webdriver'),
        OftenUsed       = require('../../OftenUsed'),
        TeamTools       = require('../SchoolPages/TeamTools/AddTeamTools.js'),
        Constants       = require('../../Constants.js');

const timerWait = 40000;

class EventTools{
    constructor(driver){
        this.driver = driver;
        this.url = Constants.domain + '/#events/calendar';
        this.addEventButtonLocator = By.className('mAddEvent');
        this.eventManagerFormLocator = By.className('eManager_base');
        this.eventDateDayLocator = By.className('eDateSelector_leftSide');
        this.eventDateMonthLocator = By.className('eDateSelector_centerSide');
        this.eventDateYearLocator = By.className('eDateSelector_rightSide');
        this.eventDateSelectLocator = By.className('mBigDateSelector');
        this.eventTimeInputLocator = By.className('bSmallTimeInput');
        this.optionLocator = By.tagName('option');
        this.comboxLocator = By.className('bCombobox');
        this.comboxListLocator = By.className('eCombobox_list');
        this.comboxOptionLocator = By.className('eCombobox_option');
        this.houseOptionLocator = By.className('bHouseListItem');
        this.showAllSportCheckboxLocator = By.className('eSwitch');
        this.genderRadioButtonLocator = By.css('div.mGenderSelector div.eRadioButtonCustom_circle');
        this.agesButtonLocator = By.className('eCustomFont-plus');
        this.multiSelectDropdownLocator = By.className('bMultiSelectDropdown');
        this.multiSelectOptionLocator = By.className('eMultiSelectDropdown_item');
        this.placeItemOptionLocator = By.className('bPlaceListItem');
        this.continueButtonLocator = By.css('div.eManager_controlButtons button');
        this.teamManagerWrapperLocator = By.className('bTeamManagerWrapper');
        this.rivalChoosersLocator = By.className('eRivalChooser_item');
        this.teamNameInputLocator = By.className('eTeamName_nameForm');
        this.selectPlayerLocator = By.className('eTeamWrapper_autocompleteWrapper');
        this.playerNameLocator = By.className('ePlayerChooser_playerName');
        this.addPlayersButtonLocator = By.className('ePlayerChooser_addToTeamButton');
        this.finishButtonLocator = By.className('bButton mFinish');
        this.popUpButtonsLocator = By.className('eConfirmPopup_footer');
        this.buttonLocator = By.className('bButton');
        this.dropdownLocator = By.className('bDropdown');
        this.schoolComboxOptionLocator = By.className('eSchoolListItem_name');
        this.teamManagerCheckboxLocator = By.css('div.eManager_radiogroup input');
        this.managerButtonsWrap = By.className('eTeamManagerWrapper_footer');
        this.createEventPageLocator = By.className('bEventContainer');
        this.selectTeamButtonLocator = By.css('div.eTeamChooser_leftSide button');
        this.managerPlayerItemLocator = By.css('div.eTeam_playerList div.eTeam_player');
        this.managerPlayerChooserItemLocator = By.css('div.ePlayerChooser_playerList div.eTeam_player');
        this.teamChooserListLocator = By.className('eTeamChooser_teamList');
        this.teamChooserListContainerLocator = By.className('eTeamChooser_teamListContainer');
        this.teamChooserTeamNameLocator = By.className('eTeamChooser_teamName');
        this.teamWrapLocator = By.className('bWrapperTeamWrapper');
        this.addTeamButtonLocator = By.css('div.bRivalChooser button');
    }

    async clickAddEventAndCheckPage(){
        await this.driver.findElement(this.addEventButtonLocator).click();
        await this.driver.wait(until.elementLocated(this.eventManagerFormLocator), timerWait);
        return Promise.resolve(true);
    }

    async setEventDate(dateString){
        const dateArray = dateString.split(' ');
        return Promise.all([
            await this.setOptionSelect(this.eventDateDayLocator, dateArray[0]),
            await this.setOptionSelect(this.eventDateMonthLocator, dateArray[1]),
            await this.setOptionSelect(this.eventDateYearLocator, dateArray[2]),
        ]);
    }

    async setEventTime(timeString){
        const timeArray = timeString.split(':');
        const timeInputs = await this.driver.findElements(this.eventTimeInputLocator);
        return Promise.all([
            await OftenUsed.characterByCharacter(this.driver,  timeInputs[0], timeArray[0]),
            await OftenUsed.characterByCharacter(this.driver,  timeInputs[1], timeArray[1]),
        ]);
    }

    async setEventGame(game, checkAllSport){
        if (checkAllSport) {
            await this.driver.findElement(this.showAllSportCheckboxLocator).click();
        }
        return await this.setOptionCombox(0, this.comboxOptionLocator, game);
    }

    async setEventGender(gender){
        const genderButtons = await this.driver.findElements(this.genderRadioButtonLocator);
        if (gender === 'BOYS'){
            return await genderButtons[0].click();
        } else {
            return await genderButtons[1].click();
        }
    }

    async setEventAges(ages){
        const agesButton = await this.driver.findElement(this.agesButtonLocator);
        await agesButton.click();
        await this.setOptionsMultiSelect(this.multiSelectDropdownLocator, ages);
        return await agesButton.click();
    }

    async setEventGameType(gameType){
        const genderButtons = await this.driver.findElements(this.genderRadioButtonLocator);
        let index;
        if (gameType === 'Inter-schools'){
            index = 2;
        } else {
            if (gameType === 'Houses'){
                index = 3;
            } else {
                index = 4;
            }
        }
        await this.driver.sleep(1000);
        return await genderButtons[index].click();
    }

    async setEventHouses(houses){
        await this.driver.sleep(1000);
        for (let i = 0; i<houses.length; ++i){
            await this.setOptionCombox(i+1, this.houseOptionLocator, houses[i]);
            await this.driver.sleep(1000);
        }
        return Promise.resolve(houses.length);
    }

    async setDistance(distance){
        await this.driver.sleep(1000);
        const wrapElem = (await this.driver.findElements(this.dropdownLocator))[3];
        await wrapElem.click();
        await OftenUsed.clickSelectOption(wrapElem, this.optionLocator, distance);
        return Promise.resolve(true);
    }

    async setEventSchools(schools){
        await this.driver.sleep(1000);
        for (let i = 0; i<schools.length; ++i){
            await this.setOptionCombox(i+1, this.schoolComboxOptionLocator, schools[i]);
            await this.driver.sleep(1000);
        }
        return Promise.resolve(schools.length);
    }

    async setEventPostcode(postcode, index){
        await this.driver.sleep(1000);
        return await this.setOptionCombox(index, this.placeItemOptionLocator, postcode);
    }

    async clickContinue(){
        return await this.driver.findElement(this.continueButtonLocator).click();
    }

    async checkTeamManagerPage(){
        await this.driver.wait(until.elementLocated(this.teamManagerWrapperLocator), timerWait);
        return Promise.resolve(true);
    }

    async addPlayersForTeams(teams){
        const rivalChoosers = await this.driver.findElements(this.rivalChoosersLocator);
        const teamNameInputs = await this.driver.findElements(this.teamNameInputLocator);
		await rivalChoosers[0].click();
        for (let i = 0; i<teams.length; ++i){
			await this.driver.sleep(1000);
			await teamNameInputs[i].click();
            await OftenUsed.characterByCharacter(this.driver,  teamNameInputs[i], teams[i].name);
            await this.driver.sleep(1000);
            await this.addPlayers(teams[i].players, i);
            if (i !== (teams.length - 1)) {
                await rivalChoosers[i + 1].click();
                const teamWrappers = await this.driver.findElements(this.teamWrapLocator);
                await this.driver.wait(until.elementIsVisible(teamWrappers[i + 1]), timerWait);
            }
        }
        return Promise.resolve(true);
    }

    async addPlayersForTeamsWithoutName(teams){
        const rivalChoosers = await this.driver.findElements(this.rivalChoosersLocator);
        for (let i = 0; i<teams.length; ++i){
            await this.addPlayers(teams[i].players, i);
            if (i !== (teams.length - 1)) {
                await rivalChoosers[i + 1].click();
                const teamWrappers = await this.driver.findElements(this.teamWrapLocator);
                await this.driver.wait(until.elementIsVisible(teamWrappers[i + 1]), timerWait);
            }
        }
        return Promise.resolve(true);
    }


    async addPlayers(players, indexTeam){
        await this.driver.sleep(2500);
        const selectPlayer = (await this.driver.findElements(this.selectPlayerLocator))[indexTeam];
        for (const player of players){
            await OftenUsed.clickSelectOption(selectPlayer, this.playerNameLocator, player);
        }
        await selectPlayer.findElement(this.addPlayersButtonLocator).click();
        await this.driver.sleep(1000);
        return Promise.resolve(true);
    }

    async selectTeamLater(moreOneTeams){
        let selectLater,
            rivalChoosers = await this.driver.findElements(this.rivalChoosersLocator);
        if (moreOneTeams){
            for ( let i = 0; i<rivalChoosers.length; ++i){
                selectLater = (await this.driver.findElements(this.teamManagerCheckboxLocator))[i];
                await selectLater.click();
                if (i !== (rivalChoosers.length - 1)){
                    await rivalChoosers[i+1].click();
                    this.driver.sleep(1000);
                }
            }
        } else {
            selectLater = (await this.driver.findElements(this.teamManagerCheckboxLocator))[0];
            await selectLater.click();
        }
        return Promise.resolve(true);
    }

    async waitTeamList(indexTeam){
        const teamChooserListContainers = await this.driver.findElements(this.teamChooserListContainerLocator);
        await this.driver.wait(until.elementIsVisible(teamChooserListContainers[indexTeam]), timerWait);
        await this.driver.sleep(2500); //костыльный таймер. Почему иногда лист с тимами подгружается сначала пустой
        return Promise.resolve(true);
    }

    async selectTeams(teamsName){
        const selectTeamButtons = await this.driver.findElements(this.selectTeamButtonLocator),
            rivalChoosers = await this.driver.findElements(this.rivalChoosersLocator);
		await rivalChoosers[0].click();
        if (teamsName.length !== 1) {
            for ( let i = 0; i<teamsName.length; ++i){
				await this.driver.sleep(1000);
                await selectTeamButtons[i].click();
                await this.waitTeamList(i);
                const teamChooserList = (await this.driver.findElements(this.teamChooserListLocator))[i];
                await OftenUsed.clickSelectOption(teamChooserList, this.teamChooserTeamNameLocator, teamsName[i]);
                if (i !== (teamsName.length - 1)){
                    await rivalChoosers[i+1].click();
                    const teamWrappers = await this.driver.findElements(this.teamWrapLocator);
                    await this.driver.wait(until.elementIsVisible(teamWrappers[i+1]), timerWait);
                } else {
                    await this.driver.sleep(2000);
                }
            }
        } else {
            await this.driver.findElement(this.selectTeamButtonLocator).click();
            await this.waitTeamList(0);
            const teamChooserList = await this.driver.findElement(this.teamChooserListLocator);
            await OftenUsed.clickSelectOption(teamChooserList, this.teamChooserTeamNameLocator, teamsName[0]);
            await this.driver.wait(until.elementLocated(this.managerPlayerItemLocator), timerWait);
            await this.driver.wait(until.elementLocated(this.managerPlayerChooserItemLocator), timerWait);
        }
        return Promise.resolve(true);
    }

    async selectPlayersIfHousesType(selectLater, selectTeams, teams, gameKind){
        switch (gameKind){
            case '1x1':
                if (selectLater){
                    await this.selectTeamLater(true);
                    await this.clickFinish();
                } else {
                    await this.addPlayersForTeamsWithoutName(teams);
                    await this.clickFinish();
                }
                break;
            case '2x2':
                if (selectLater) {
                    await this.selectTeamLater(true);
                    await this.clickFinish();
                } else {
                    if (selectTeams){
                        await this.selectTeams(selectTeams);
                        await this.clickFinish();
                    } else {
                        await this.addPlayersForTeams(teams);
                        await this.clickFinish();
                        await this.createEvent();
                    }
                }
                break;
            case 'Team':
                if (selectLater) {
                    await this.selectTeamLater(true);
                    await this.clickFinish();
                } else {
                    if (selectTeams){
                        await this.selectTeams(selectTeams);
                        await this.clickFinish();
                    } else {
                        await this.addPlayersForTeams(teams);
                        await this.clickFinish();
                        await this.createEvent();
                    }
                }
                break;
            case 'Individ':
                if (selectLater) {
                    await this.selectTeamLater(true);
                    await this.clickFinish();
                } else {
                    await this.addPlayersForTeamsWithoutName(teams);
                    await this.clickFinish();

                }
                break;
        }
        return Promise.resolve(true);
    }

    async selectPlayersIfInternalType(selectLater, selectTeams, teams, gameKind){
        let countTeam;
        switch (gameKind){
            case '1x1':
                if (selectLater){
                    await this.selectTeamLater(true);
                    await this.clickFinish();
                } else {
                    await this.addPlayersForTeamsWithoutName(teams);
                    await this.clickFinish();
                }
                break;
            case '2x2':
                if (selectLater) {
                    await this.selectTeamLater(true);
                    await this.clickFinish();
                } else {
                    if (selectTeams){
                        countTeam = selectTeams.length;
                        if (countTeam > 2) {
                            await this.addNewTeam(countTeam - 2); // две команды добавленые по умолчанию
                        }
                        await this.selectTeams(selectTeams);
                        await this.clickFinish();
                    } else {
                        countTeam = teams.length;
                        if (countTeam > 2) {
                            await this.addNewTeam(countTeam - 2); // две команды добавленые по умолчанию
                        }
                        await this.addPlayersForTeams(teams);
                        await this.clickFinish();
                        await this.createEvent();
                    }
                }
                break;
            case 'Team':
                if (selectLater) {
                    await this.selectTeamLater(true);
                    await this.clickFinish();
                } else {
                    if (selectTeams){
                        countTeam = selectTeams.length;
                        if (countTeam > 2) {
                            await this.addNewTeam(countTeam - 2); // две команды добавленые по умолчанию
                        }
                        await this.selectTeams(selectTeams);
                        await this.clickFinish();
                    } else {
                        countTeam = teams.length;
                        if (countTeam > 2) {
                            await this.addNewTeam(countTeam - 2); // две команды добавленые по умолчанию
                        }
                        await this.addPlayersForTeams(teams);
                        await this.clickFinish();
                        await this.createEvent();
                    }
                }
                break;
            case 'Individ':
                if (selectLater) {
                    await this.selectTeamLater(false);
                    await this.clickFinish();
                } else {
                    await this.addPlayers(teams[0].players, 0);
                    await this.clickFinish();

                }
                break;
        }
        return Promise.resolve(true);
    }

    async addNewTeam(countAddTeam){
        for (let i=0; i< countAddTeam; ++i){
            await this.driver.findElement(this.addTeamButtonLocator).click();
        }
        return Promise.resolve(true);
    }

    async selectPlayersIfInterSchoolType(selectLater, selectTeams, teams, gameKind){
        switch (gameKind){
            case '1x1':
                if (selectLater) {
                    await this.selectTeamLater(false);
                    await this.clickFinish();
                } else {
                    await this.addPlayers(teams[0].players, 0);
                    await this.clickFinish();
                }
                break;
            case '2x2':
                if (selectLater) {
                    await this.selectTeamLater(false);
                    await this.clickFinish();
                } else {
                    if (selectTeams){
                        await this.selectTeams(selectTeams);
                        await this.clickFinish();
                    } else {
                        const teamNameInputs = await this.driver.findElements(this.teamNameInputLocator);
                        await teamNameInputs[0].click();
                        await OftenUsed.characterByCharacter(this.driver,  teamNameInputs[0], teams[0].name);
                        await this.addPlayers(teams[0].players, 0);
                        await this.clickFinish();
                        await this.createEvent();
                    }
                }
                break;
            case 'Team':
                if (selectLater) {
                    await this.selectTeamLater(false);
                    await this.clickFinish();
                } else {
                    if (selectTeams){
                        await this.selectTeams(selectTeams);
                        await this.clickFinish();
                    } else {
                        const teamNameInputs = await this.driver.findElements(this.teamNameInputLocator);
                        await teamNameInputs[0].click();
                        await OftenUsed.characterByCharacter(this.driver,  teamNameInputs[0], teams[0].name);
                        await this.addPlayers(teams[0].players, 0);
                        await this.clickFinish();
                        await this.createEvent();
                    }
                }
                break;
            case 'Individ':
                if (selectLater) {
                    await this.selectTeamLater(false);
                    await this.clickFinish();
                } else {
                    await this.addPlayers(teams[0].players, 0);
                    await this.clickFinish();
                }
                break;
        }
        return Promise.resolve(true);
    }
    async clickFinish(){
        await this.driver.sleep(2000);
        const finishButton = await this.driver.findElement(this.finishButtonLocator);
        await this.driver.wait(until.elementIsEnabled(finishButton), timerWait);
        return await finishButton.click();
    }

   async createEvent(){
        await this.driver.wait(until.elementLocated(this.popUpButtonsLocator), timerWait);
        const buttonsPopUpWarp = await this.driver.findElement(this.popUpButtonsLocator);
        const createEventButton = (await buttonsPopUpWarp.findElements(this.buttonLocator))[1];
        return await createEventButton.click();
   }

   async checkCompleteCreatePage(){
       await this.driver.wait(until.elementLocated(this.createEventPageLocator), timerWait);
       await this.driver.navigate().to(this.url);
       return Promise.resolve(true);
   }

    async setOptionSelect(wrapLocator, text){
        const wrapElem = await this.driver.findElement(wrapLocator);
        await wrapElem.findElement(this.eventDateSelectLocator).click();
        await OftenUsed.clickSelectOption(wrapElem, this.optionLocator, text);
        return Promise.resolve(true);
    }

    async setOptionCombox(wrapIndex, optionLocator, text){
        const combox = (await this.driver.findElements(this.comboxLocator))[wrapIndex];
        await combox.click();
        await this.driver.wait(until.elementIsVisible(await combox.findElement(this.comboxListLocator)),timerWait);
        await OftenUsed.clickSelectOption(combox, optionLocator, text);
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


module.exports = EventTools;