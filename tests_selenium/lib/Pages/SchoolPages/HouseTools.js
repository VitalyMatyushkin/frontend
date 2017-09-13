/**
 * Created by Vitaly on 09.06.17.
 */
const   {By}         = require('selenium-webdriver'),
        OftenUsed    = require('../../OftenUsed'),
        Constants    = require('../../Constants.js'),
        SchoolPage   = require('./SchoolPage.js');

class HouseTools{
    constructor(driver){
        this.driver = driver;
        this.urlHouse = Constants.domain + '/#school_admin/houses';
        this.urlAddHouse = Constants.domain + '/#school_admin/houses/add';
        this.filterButtonLocator = By.className('filter_btn');
        this.dataListItemLocator = By.className('eDataList_listItem');
        this.itemCellLocator = By.className('eDataList_listItemCell');
        this.colorCellLocator = By.className('eDataList_listItemColor');
        this.imageCellLocator = By.css('div.eDataList_listItemCell img');
        this.formLocator = By.className('bForm');
        this.formFieldLocator = By.className('eForm_field');
        this.addColorLocator = By.className('eColorsSelect_addButton');
        this.paletteLocator = By.className('picker');
        this.colorButtonLocator = By.css('div.bButton');
        this.colorRemovableLocator = By.className('eColorsSelect_color mRemovable');
    }


    async visitAddHousePage(){
        return await SchoolPage.visit(this.driver, this.urlAddHouse);
    }

	async setHouseImage(filePath){
		return await SchoolPage.addNewImage(this.driver, 0, filePath);
	}

    async setHouseName(houseName){
		return await SchoolPage.setTextFieldInput(this.driver, 1, houseName);
    }

    async setHouseDescription(description){
        return await SchoolPage.setTextFieldInput(this.driver, 2, description);
    }

    //Добавляем цвет из палитры. Если уже есть 2 цвета, то не добавляем
    async setColor(){
        const   colorField = (await this.driver.findElements(this.formFieldLocator))[3],
                addedColor = await colorField.findElements(this.colorRemovableLocator);
        if (addedColor.length < 2){
            await colorField.findElement(this.addColorLocator).click();
            await colorField.findElement(this.paletteLocator).click();
            const acceptColorButton = (await colorField.findElements(this.colorButtonLocator))[1];
            await acceptColorButton.click();
        }
        return Promise.resolve(true);
    }

    async submit(){
        return await SchoolPage.clickSubmitOnSavepanel(this.driver);
    }

    async editClick(resultLine){
        return await SchoolPage.clickEditInTable(this.driver, resultLine, 4);
    }

    async checkEditPage(){
        return await  SchoolPage.checkPage(this.driver, this.formLocator);
    }

    async editHouseName(houseName){
        return await SchoolPage.editTextFieldInput(this.driver, 1, houseName);
    }

    async editHouseDescription(description){
        return await SchoolPage.editTextFieldInput(this.driver, 2, description);

    }

    async visitHousesPage(){
        await SchoolPage.visit(this.driver, this.urlHouse);
        return await SchoolPage.checkPage(this.driver, this.filterButtonLocator);
    }

    async openFilter(){
        return await SchoolPage.openFilterSearch(this.driver);
    }

    async setHouseNameFind(houseName){
        await SchoolPage.hoverAndSetTextInput(this.driver, 0, houseName);
        return await SchoolPage.waitLoader(this.driver);
    }

    async setDescription(description){
        await SchoolPage.hoverAndSetTextInput(this.driver, 1, description);
        return await SchoolPage.waitLoader(this.driver);
    }

    async checkColor(indexLine){
        let item = (await this.driver.findElements(this.dataListItemLocator))[indexLine];
        return await item.findElement(this.colorCellLocator);
    }

	async checkImage(indexLine){
		let item = (await this.driver.findElements(this.dataListItemLocator))[indexLine];
		return await item.findElement(this.imageCellLocator);
	}

    async checkResult(house){
        await this.driver.sleep(500);
        const items = await this.driver.findElements(this.dataListItemLocator);
        let result = 0;
        for (let i=1; i<items.length; ++i){
            const item = (await this.driver.findElements(this.dataListItemLocator))[i],
                    cellHouseName = (await item.findElements(this.itemCellLocator))[1],
                    textNameCell = await cellHouseName.getText(),
                    cellDescription = (await item.findElements(this.itemCellLocator))[2],
                    textDescriptionCell = await cellDescription.getText();
            if (textNameCell === house.houseName && textDescriptionCell === house.description
                &&  (await this.checkColor(i)) &&  (await this.checkImage(i))){
                result = i;
                break;
            }
        }
        return new Promise(
            (resolve, reject) => {
                if (result > 0){
                    resolve(result);
                } else {
                    reject(new Error('House was not found'));
                }
            }
        );
    }

    async findHouse(house){
        await this.visitHousesPage();
        await this.openFilter();
        await this.setHouseNameFind(house.houseName);
        await this.setDescription(house.description);
        return Promise.resolve(true);
    }

}

module.exports = HouseTools;
