/**
 * Created by Vitaly on 08.06.17.
 */
const   {By}        = require('selenium-webdriver');
        test        = require('selenium-webdriver/testing');
        OftenUsed   = require('../../lib/OftenUsed.js');
        Driver      = require('../Driver.js');

const timeout = 70000;

Promise.USE_PROMISE_MANAGER = false;

test.describe('Check help page', function(){
    this.timeout(timeout);
    let driver,
        urlHelp = 'http://docs.squadintouch.com/',
        helpLocator = By.className('entry-content');

    test.before(async () => {
        driver = Driver.startDriver();
    });

    test.it('Help page', async () => {
        driver.navigate().to(urlHelp);
        OftenUsed.checkPage(helpLocator, driver);
    });


    test.after(async () => {
        await driver.quit()
    });
});