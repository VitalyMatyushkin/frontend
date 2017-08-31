/**
 * Created by Vitaly on 07.06.17.
 */
const   {By}        = require('selenium-webdriver'),
        OftenUsed   = require('../OftenUsed.js'),
        Constants   = require('../Constants.js');

const   achievementsLocator = By.className('eAllAchievements_container'),
        urlAchievements = Constants.domain + '/#events/achievement/all',
        achievementsUserColumnLocator = By.className('bUserColumn'),
        achievementsUserDataColumnLocator = By.className('bUserDataColumn');

/**
 * Navigate and check all pages in the submenu
 * @param driver
 * @returns {Promise.<boolean>}
 */
class AchievemetsPage{
    static async checkAllPage(driver){
        await driver.navigate().to(urlAchievements);
        await OftenUsed.checkPage(achievementsLocator, driver);
        await driver.sleep(2000);
        await driver.findElement(By.className('eSubMenu_item ')).click();
        await OftenUsed.checkPage(achievementsUserColumnLocator, driver);
        await OftenUsed.checkPage(achievementsUserDataColumnLocator, driver);

        return Promise.resolve(true);
    }
}

module.exports = AchievemetsPage;