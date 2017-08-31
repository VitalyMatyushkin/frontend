/**
 * Created by Vitaly on 14.06.17.
 */
const   {By}         = require('selenium-webdriver'),
        OftenUsed    = require('../../OftenUsed'),
        Constants    = require('../../Constants.js'),
        SchoolPage   = require('./SchoolPage.js');

class NewsTools{
    constructor(driver){
        this.driver = driver;
        this.urlNews = Constants.domain + '/#school_admin/news';
        this.urlAddNews = Constants.domain + '/#school_admin/news/add';
        this.inputTextLocator = By.css('div.eFilterContainer input');
        this.dataListItemLocator = By.className('eDataList_listItem');
        this.itemCellLocator = By.className('eDataList_listItemCell');
        this.formLocator = By.className('bNewsEdit');
        this.filterButtonLocator = By.className('filter_btn');
        this.inputLocator = By.css('input');
        this.formFieldLocator = By.className('eForm_field');
    }

    async visitAddNewsPage(){
        return await SchoolPage.visit(this.driver, this.urlAddNews);
    }

    async setTitle(title){
        return await SchoolPage.setTextFieldInput(this.driver, 0, title);
    }

    async setDate(date){
        const field = (await this.driver.findElements(this.formFieldLocator))[1];
        const input = await field.findElement(this.inputLocator);
        return await input.sendKeys(date);
        // return await SchoolPage.setTextFieldInput(this.driver, 1, date);
    }

    async setText(text){
        return await SchoolPage.setTextFieldTextarea(this.driver, 2, text);
    }

    async setImage(filePath){
        return await SchoolPage.addNewImage(this.driver, 3, filePath);
    }

    async submit(){
        return await SchoolPage.clickSubmitOnSavepanel(this.driver);
    }

    async editClick(resultLine){
        return await SchoolPage.clickEditInTable(this.driver, resultLine, 3);
    }

    async checkEditPage(){
        return await SchoolPage.checkPage(this.driver, this.formLocator);
    }

    async editTitle(title){
        return await SchoolPage.editTextFieldInput(this.driver, 0, title);
    }

    async editDate(date){
        const field = (await this.driver.findElements(this.formFieldLocator))[1];
        const input = await field.findElement(this.inputLocator);
        await OftenUsed.clearText(input);
        return await input.sendKeys(date);
        // return await SchoolPage.editTextFieldInput(this.driver, 1, date);
    }

    async editText(text){
        return await SchoolPage.editTextFieldTextarea(this.driver, 2, text);
    }

    async visitNewsPage(){
        await SchoolPage.visit(this.driver, this.urlNews);
        return await SchoolPage.checkPage(this.driver, this.filterButtonLocator);
    }

    async openFilter(){
        return await SchoolPage.openFilterSearch(this.driver);
    }

    async setTitleFind(title){
        await SchoolPage.hoverAndSetTextInput(this.driver, 0, title);
        return await SchoolPage.waitLoader(this.driver);
    }

    async setDateFrom(dateFrom){
        const dateFromField = await SchoolPage.findAndHoverElem(this.driver, 1);
        const fromInput = (await dateFromField.findElements(this.inputTextLocator))[0];
        await fromInput.clear();
        // return await OftenUsed.characterByCharacter(this.driver,  fromInput, dateFrom);
        // return await SchoolPage.waitLoader(this.driver);
        return await fromInput.sendKeys(dateFrom);

    }

    async setDateTo(dateTo){
        const dateToField = await SchoolPage.findAndHoverElem(this.driver, 1);
        const dateToInput = (await dateToField.findElements(this.inputTextLocator))[1];
        await dateToInput.clear();
        // return await OftenUsed.characterByCharacter(this.driver,  dateToInput, dateTo);
        // return await SchoolPage.waitLoader(this.driver);
        return await dateToInput.sendKeys(dateTo);
    }

    async checkResult(news){
        await this.driver.sleep(1000);
        const items = await this.driver.findElements(this.dataListItemLocator);
        let result = 0;
        for (let i=1; i<items.length; ++i){
            const item = (await this.driver.findElements(this.dataListItemLocator))[i],
                    cellTitle = (await item.findElements(this.itemCellLocator))[1],
                    textTitle = await cellTitle.getText(),
                    cellDate = (await item.findElements(this.itemCellLocator))[2],
                    textDate = await cellDate.getText();
            if (textTitle === news.title && textDate === news.date){
                result = i;
                break;
            }
        }
        return new Promise(
            (resolve, reject) => {
                if (result > 0){
                    resolve(result);
                } else {
                    reject(new Error('News was not found'));
                }
            }
        );
    }

    async findNews(news){
        await this.visitNewsPage();
        await this.openFilter();
        await this.setTitleFind(news.title);
        await this.setDateFrom(news.dateFrom);
        await this.setDateTo(news.dateTo);
    }

}

module.exports = NewsTools;
