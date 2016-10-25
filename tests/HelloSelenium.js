/**
 * Created by wert on 24.10.16.
 */

const webdriver = require('selenium-webdriver');
const driver = new webdriver.Builder().forBrowser('chrome') .build(); // ask the browser to open a page

const By = webdriver.By;

// driver.navigate().to('http://google.ru');

// driver.navigate().to('http://google.ru')
// 	.then(() => driver.findElement(By.name('btnK')))
// 	.then(element => element.getAttribute('value'))
// 	.then(value => console.log(value));
//
//
// driver.quit();



driver.navigate().to('http://login.stage1.squadintouch.com');
