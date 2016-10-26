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



driver.navigate().to('http://login.squard.com:8080');

const 	loginInput		= driver.findElement(By.id('login_email')),
		passwordInput	= driver.findElement(By.id('login_password')),
		submitButton	= driver.findElement(By.id('login_submit'));

// loginInput.sendKeys('referencesquadintouch.com');	// this leads to bug

'reference@squadintouch.com'.split('').forEach( c => loginInput.sendKeys(c));
'reference'.split('').forEach(c => passwordInput.sendKeys(c));
submitButton.click();




// driver.quit();
