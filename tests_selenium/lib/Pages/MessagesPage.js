/**
 * Created by Vitaly on 07.06.17.
 */
const   {By}        = require('selenium-webdriver'),
        OftenUsed   = require('../OftenUsed.js'),
        Constants   = require('../Constants.js');

const   urlMessagesInbox = Constants.domain + '/#messages/inbox',
        urlMessagesOutbox = Constants.domain + '/#messages/outbox',
        urlMessagesArchive = Constants.domain + '/#messages/archive',
        messagesLocator = By.className('bInvites');

class MessagesPage{
    /**
     * Navigate and check all pages in the submenu
     * @param driver
     * @returns {Promise.<boolean>}
     */
    static async checkAllPage(driver){
        await driver.navigate().to(urlMessagesInbox);
        await OftenUsed.checkPage(messagesLocator, driver);

        await driver.navigate().to(urlMessagesOutbox);
        await OftenUsed.checkPage(messagesLocator, driver);

        await driver.navigate().to(urlMessagesArchive);
        await OftenUsed.checkPage(messagesLocator, driver);

        return Promise.resolve(true);
    }
}

module.exports = MessagesPage;