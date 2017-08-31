/**
 * Created by Vitaly on 13.06.17.
 */
const   {By}         = require('selenium-webdriver'),
        OftenUsed    = require('../../../OftenUsed'),
        Constants    = require('../../../Constants.js'),
        SchoolPage   = require('../SchoolPage.js');

class FindTeamTools{
    constructor(driver){
        this.driver = driver;
        this.urlTeam = Constants.domain + '/#school_admin/teams';
        this.filterButtonLocator = By.className('filter_btn');
        this.multiselectItemLocator = By.className('eMultiSelect_item');
        this.inputTextLocator = By.css('div.eFilterContainer input');
        this.dataListItemLocator = By.className('eDataList_listItem');
        this.itemCellLocator = By.className('eDataList_listItemCell');
    }

    async visitTeamPage(){
        await SchoolPage.visit(this.driver, this.urlTeam);
        return await SchoolPage.checkPage(this.driver, this.filterButtonLocator);
    }

    async openFilter(){
        return await SchoolPage.openFilterSearch(this.driver);
    }

    async setGender(gender){
        const genderField = await SchoolPage.findAndHoverElem(this.driver, 3);
        let teamGenderElem;
        if (gender === 'MALE'){
            teamGenderElem = (await genderField.findElements(this.multiselectItemLocator))[0];
        }
        else {
            if (gender === 'FEMALE') {
                teamGenderElem = (await genderField.findElements(this.multiselectItemLocator))[1];
            } else {
                teamGenderElem = (await genderField.findElements(this.multiselectItemLocator))[2];
            }
        }
        await teamGenderElem.click();
        return await SchoolPage.waitLoader(this.driver);
    }

    async setName(name){
        await SchoolPage.hoverAndSetTextInput(this.driver, 1, name);
        return await SchoolPage.waitLoader(this.driver);
    }

    async setDescription(description){
        await SchoolPage.hoverAndSetTextInput(this.driver, 2, description);
        return await SchoolPage.waitLoader(this.driver);
    }

    async setSport(sport){
        const sportField = await SchoolPage.findAndHoverElem(this.driver, 0);
        await this.driver.sleep(1000);
        await SchoolPage.markElemMultiselect(sportField, sport);
        return await SchoolPage.waitLoader(this.driver);
    }

    async checkResult(team){
        await this.driver.sleep(1000);
        const items = await this.driver.findElements(this.dataListItemLocator);
        let result = 0;
        for (let i=1; i<items.length; ++i){
            const item = (await this.driver.findElements(this.dataListItemLocator))[i];
            const itemCells = await item.findElements(this.itemCellLocator);
            const sportCell = await itemCells[1].getText();
            const nameCell = await itemCells[2].getText();
            const descriptionCell = await itemCells[3].getText();
            const agesCell = await itemCells[5].getText();
            if (nameCell === team.name
                && sportCell === team.sport
                && descriptionCell === team.description
                && (await SchoolPage.getGender(this.driver, i)) === team.gender
                && agesCell === team.ages)
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
                    reject(new Error('Team was not found'));
                }
            }
        );
    }

    async findTeam(team){
        await this.visitTeamPage();
        await this.openFilter();
        await this.setSport(team.sport);
        await this.setName(team.name);
        await this.setDescription(team.description);
        await this.setGender(team.gender);

        return Promise.resolve(true);
    }

}

module.exports = FindTeamTools;
