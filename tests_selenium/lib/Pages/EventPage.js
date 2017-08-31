/**
 * Created by Vitaly on 07.06.17.
 */
const   {By}        = require('selenium-webdriver'),
        OftenUsed   = require('../OftenUsed.js'),
        Constants   = require('../Constants.js');

const   urlEventsFixtures = Constants.domain + '/#events/fixtures',
        fixturesLocator = By.className('bFixtures'),
        calendarLocator = By.className('bEvents');

class EventPage{
    /**
     * Navigate and check all pages in the submenu
     * @param driver
     * @returns {Promise.<boolean>}
     */
    static async checkAllPage(driver){
        await OftenUsed.checkPage(calendarLocator, driver);
        await driver.navigate().to(urlEventsFixtures);
        await OftenUsed.checkPage(fixturesLocator, driver);
        return Promise.resolve(true);
    }
}

module.exports = EventPage;