/**
 * Created by Vitaly on 07.06.17.
 */
const   {By}        = require('selenium-webdriver'),
        OftenUsed   = require('../OftenUsed.js'),
        Constants   = require('../Constants.js');

const   urlConsoleUsers = Constants.domain + '/#school_console/users',
        urlConsoleRequests = Constants.domain + '/#school_console/requests',
        urlConsoleArchive = Constants.domain + '/#school_console/archive',
        urlConsoleModeration = Constants.domain + '/#school_console/moderation',
        urlConsoleVenues = Constants.domain + '/#school_console/venues',
        urlConsoleIntegration = Constants.domain + '/#school_console/integration',
        urlConsoleSports = Constants.domain + '/#school_console/sports',
        consoleTableLocator = By.css('div.bSchoolMaster h1.eTitle'),
        consoleModerationLocator = By.className('bModerationPage'),
        consolePageTables =[{url: urlConsoleUsers, text: 'Users & Permissions'},
                            {url: urlConsoleRequests, text: 'New Requests'},
                            {url: urlConsoleArchive, text: 'Requests archive'},
                            {url: urlConsoleVenues, text: 'Venues'},
                            {url: urlConsoleIntegration, text: 'Integration'},
                            {url: urlConsoleSports, text: 'Sports'}];
class ConsolePage{
    /**
     * Navigate and check all pages in the submenu
     * @param driver
     * @returns {Promise.<boolean>}
     */
    static async checkAllPage(driver){
        for (let page of consolePageTables){
            await driver.navigate().to(page.url);
            await driver.sleep(1000);
            await OftenUsed.checkPage(consoleTableLocator, driver);
			await driver.sleep(1000);
            await OftenUsed.checkTextWebElem(driver, consoleTableLocator, page.text);
        }
        await driver.navigate().to(urlConsoleModeration);
        await OftenUsed.checkPage(consoleModerationLocator, driver);
        return Promise.resolve(true);
    }
}

module.exports = ConsolePage;