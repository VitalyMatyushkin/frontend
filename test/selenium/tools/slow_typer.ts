/**
 * Created by wert on 05.03.2018
 */
import {WebDriver, WebElement, WebElementPromise} from "selenium-webdriver";


/**
 * This function does the same thing as `sendKeys` except that it performs input slowly char-by-char awaiting for
 * each char to be obtained
 */
export async function slowTyper(driver: WebDriver, webElem: WebElement|WebElementPromise, input: string, optTimeout?: number){
	// getting default implicit wait time
	const {implicit} = await (driver.manage() as any).getTimeouts();

	let acc = '';
	for (let i = 0; i < input.length; i++){
		const currentChar = input.charAt(i);
		await webElem.sendKeys(currentChar);
		acc += currentChar;
		await driver.wait( async () => {
			const value = await webElem.getAttribute('value');
			if (value === acc) {
				return value;
			}
		},optTimeout ? optTimeout : implicit);
	}
}