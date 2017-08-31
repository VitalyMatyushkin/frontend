/**
 * Created by Vitaly on 09.06.17.
 */

const   test                = require('selenium-webdriver/testing'),
        SchoolPage          = require('../../../lib/Pages/SchoolPages/SchoolPage.js'),
        OftenUsed           = require('../../../lib/OftenUsed.js'),
        HouseTools          = require('../../../lib/Pages/SchoolPages/HouseTools.js'),
        Driver              = require('../../Driver.js');

const   timeout = 70000,
        house = {
            houseName: 'TestHouse',
            description: 'Test description'
        };

Promise.USE_PROMISE_MANAGER = false;

test.describe('Add new house', function(){
    this.timeout(timeout);
    let driver;
    const   email = 'reference@squadintouch.com',
            pass = 'reference',
            role = 'ADMIN';

    test.before(async () => {
        driver = Driver.startDriver();
        await  SchoolPage.loginAndSelectRole(driver, email, pass, role);
    });

    test.it('Add house', async () => {
        let toolsHouse = new HouseTools(driver);
        await toolsHouse.visitAddHousePage();
        await toolsHouse.setHouseName(house.houseName);
        await toolsHouse.setHouseDescription(house.description);
        await toolsHouse.setColor();
        await toolsHouse.submit();

        await toolsHouse.findHouse(house);
        await toolsHouse.checkResult(house);
    });

    test.after(async () => {
        await driver.quit()
    });
});

