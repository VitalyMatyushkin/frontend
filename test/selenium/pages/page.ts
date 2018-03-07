/**
 * Created by wert on 28.02.2018
 */

import {WebDriver} from "selenium-webdriver";

export class Page {

	readonly driver: WebDriver;
	readonly fullUrl: string;

	constructor(driver: WebDriver, baseUrl: string, pagePath: string) {
		this.driver = driver;
		this.fullUrl = baseUrl + pagePath;
	}

	async getImplicitWaitTimeout(): Promise<number> {
		// there is no this method on typings, but in js it really exists. Check sources
		const {implicit, pageLoad, script} = await (this.driver.manage() as any).getTimeouts();
		return implicit;
	}

	/**
	 * check whether browser is on this page.
	 * This page determined by `fillUrl` property.
	 * Check performed in Selenium way: it performs check multiple times during some waiting time.
	 * If during this time browser not redirected to given page false will be returned.
	 * If you need to throw exception see {Page.waitToBeOnPage}
	 * @param optTimeout optional explicit timeout to wait for
	 * @return {Promise<boolean>}
	 */
	async isOnPage(optTimeout?: number): Promise<boolean> {
		const timeout = optTimeout ? optTimeout : await this.getImplicitWaitTimeout();

		return this.driver.wait(async () => {
			const currentUrl = await this.driver.getCurrentUrl();
			return currentUrl === this.fullUrl;
		}, timeout).then( () => true, () => false);
	}

	/**
	 * Check whether browser is on page. If during timeout browser will not visit given page timeout exception will be thrown
	 * @param {number} optTimeout
	 * @return {Promise<void>}
	 */
	async waitToBeOnPage(optTimeout?: number): Promise<void> {
		const timeout = optTimeout ? optTimeout : await this.getImplicitWaitTimeout();

		return this.driver.wait(async () => {
			const currentUrl = await this.driver.getCurrentUrl();
			return currentUrl === this.fullUrl;
		}, timeout).then( () => void 0);
	}

	/**
	 * redirects browser to page specified as `fullUrl` class property
	 * @param {number} optTimeout
	 * @return {Promise<string>} string with full url in case of success
	 */
	async visit(optTimeout?: number): Promise<string> {
		await this.driver.get(this.fullUrl);

		const isOnPage = await this.isOnPage(optTimeout);
		if(isOnPage) {
			return this.fullUrl;
		} else {
			throw new Error(`url not found: ${this.fullUrl}`);
		}
	}


}