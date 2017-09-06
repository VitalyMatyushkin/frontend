/**
 * Created by Vitaly on 07.06.17.
 */
const   {By}        = require('selenium-webdriver'),
        OftenUsed   = require('../OftenUsed.js'),
        Constants   = require('../Constants.js');

const   fixturesLocator = By.className('bSchoolMaster'),
        urlEventsFixtures = Constants.domain + '/#events/fixtures/all';

class FixturesPage{
    /**
     * Navigate and check all pages in the submenu
     * @param driver
     * @returns {Promise.<boolean>}
     */
    static async checkAllPage(driver){
        await driver.navigate().to(urlEventsFixtures);
        await OftenUsed.checkPage(fixturesLocator, driver);
        await driver.sleep(500);
        await driver.findElement(By.className('eSubMenu_item ')).click();
        await OftenUsed.checkPage(fixturesLocator, driver);
        return Promise.resolve(true);
    }
}

module.exports = FixturesPage;