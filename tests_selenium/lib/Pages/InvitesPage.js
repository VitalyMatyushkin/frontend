/**
 * Created by Vitaly on 07.06.17.
 */
const   {By}        = require('selenium-webdriver'),
        OftenUsed   = require('../OftenUsed.js'),
        Constants   = require('../Constants.js');

const   urlInvitesInbox = Constants.domain + '/#invites/inbox',
        urlInvitesOutbox = Constants.domain + '/#invites/outbox',
        urlInvitesArchive = Constants.domain + '/#invites/archive',
        invitesLocator = By.className('bInvites');

class InvitesPage{
    /**
     * Navigate and check all pages in the submenu
     * @param driver
     * @returns {Promise.<boolean>}
     */
    static async checkAllPage(driver){
        await driver.navigate().to(urlInvitesInbox);
        await OftenUsed.checkPage(invitesLocator, driver);

        await driver.navigate().to(urlInvitesOutbox);
        await OftenUsed.checkPage(invitesLocator, driver);

        await driver.navigate().to(urlInvitesArchive);
        await OftenUsed.checkPage(invitesLocator, driver);
        return Promise.resolve(true);
    }

}

module.exports = InvitesPage;