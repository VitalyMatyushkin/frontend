/**
 * Created by root on 05.06.17.
 */
const   {By, until, Key} = require('selenium-webdriver');

class OftenUsed{
    //Entering characters one by one
    static async characterByCharacter(driver, webElem, string){
        const arrayStr = string.split('');
        let str = '';
        for (let i = 0; i < arrayStr.length; i++){
            await webElem.sendKeys(arrayStr[i]);
            str += arrayStr[i];
            await driver.wait( async () => {
                const value = await webElem.getAttribute('value');
                if (value === str) {
                    return value;
                }
            },2000);
        }
        return Promise.resolve(true);
    }

    static async checkPage(locator, driver){
        return await driver.wait(until.elementLocated(locator), 50000);
    }

    static async checkTextWebElem(driver, locator, text){
        const webElem = await driver.findElement(locator);
        // const textElem = await webElem.getAttribute('value');
        const textElem = await webElem.getText();
        return new Promise(
            (resolve, reject) => {
                if (textElem === text){
                    resolve(true);
                } else {
                    reject(new Error('Text: ' + text + ' was not found'));
                }
            }
        );
    }

    static async checkAttributeWebElem(driver, locator, attribute, text){
        const webElem = await driver.findElement(locator);
        const textElem = await webElem.getAttribute(attribute);
        return new Promise(
            (resolve, reject) => {
                if (textElem === text){
                    resolve(true);
                } else {
                    // reject(new Error('Text: ' + text + ' was not found'));
                    reject(textElem);
                }
            }
        );
    }

    static async clearText(webElem){
        return await webElem.sendKeys(Key.HOME,Key.chord(Key.SHIFT,Key.END),'\b');
    }

    static async clickSelectOption(webElem, locatorOption, itemText){
        const itemOptions = await webElem.findElements(locatorOption);
        for(const itemElem of itemOptions){
            if((await itemElem.getText()) === itemText){
                await itemElem.click();
                return Promise.resolve(true);
            }
        }
        return Promise.reject(new Error('Element was not found'));
    }

}

module.exports = OftenUsed;
