/**
 * Created by wert on 26.02.2018
 */


import {DriverFactory} from "./tools/driver_factory";
import {Builder, By, Key, until} from 'selenium-webdriver';
import {expect} from 'chai';



describe('Login page', () => {

	let driver;

	before( () => {
		driver = DriverFactory.getDriver();
	});


	it('should load yandex', async () => {
		await driver.get('http://ya.ru');
	});

	it('should load google', async () => {
		await driver.get('http://google.com');
	});


	after( async () => {
		if(driver) {
			await driver.quit();
		}
	});
});