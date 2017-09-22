/**
 * Created by Vitaly on 12.06.17.
 */

const   test                = require('selenium-webdriver/testing'),
        SchoolPage          = require('../../../lib/Pages/SchoolPages/SchoolPage.js'),
        OftenUsed           = require('../../../lib/OftenUsed.js'),
        HouseTools          = require('../../../lib/Pages/SchoolPages/HouseTools.js'),
        Driver              = require('../../Driver.js'),
        Constants           = require('../../../lib/Constants.js');

const   timeout = 70000,
        house = {
            houseName: 'TestHouse',
            description: 'Test description'
        },
        houseEdit = {
			filePath: Constants.imagePath,
			houseName: 'TestHouse',
            description: 'Test description'
        };

Promise.USE_PROMISE_MANAGER = false;

test.describe('Edit form', function(){
    this.timeout(timeout);
    let driver;
    const   email = 'reference@squadintouch.com',
            pass = 'reference',
            role = 'ADMIN';

    test.before(async () => {
        driver = Driver.startDriver();
        await  SchoolPage.loginAndSelectRole(driver, email, pass, role);
    });

    test.it('Edit house', async () => {
        let toolsHouse = new HouseTools(driver);
        await toolsHouse.findHouse(house);
        let resultLine = await toolsHouse.checkResult(house);

        await toolsHouse.editClick(resultLine);
        await toolsHouse.checkEditPage();
		await toolsHouse.setHouseImage(houseEdit.filePath);
		await toolsHouse.editHouseName(houseEdit.houseName);
        await toolsHouse.editHouseDescription(houseEdit.description);
        await toolsHouse.setColor();
        await toolsHouse.submit();

        await toolsHouse.findHouse(houseEdit);
        await toolsHouse.checkResult(houseEdit);
    });

    test.after(async () => {
        await driver.quit()
    });
});

