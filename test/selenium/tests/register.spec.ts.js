/**
 * Created by wert on 27.02.2018
 */

import {DriverFactory} from "../tools/driver_factory";


describe('Register scene', () => {
	let driver;
	let baseUrl = 'http://app.squard.com:8080';

	before( async () => {
		driver = DriverFactory.getDriver();
		await driver.manage().timeouts().implicitlyWait(10000);
	});



	after( async () => {
		if(driver) {
			await driver.quit();
		}
	});
});