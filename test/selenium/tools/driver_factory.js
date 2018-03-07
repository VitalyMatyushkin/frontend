"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebDriverChrome = require("selenium-webdriver/chrome");
var WebDriverFirefox = require("selenium-webdriver/firefox");
var chromedriver = require("chromedriver");
var geckodriver = require("geckodriver");
/**
 * Created by wert on 26.02.2018
 */
// simple factory to provide correct and tuned drivers
var DriverFactory = /** @class */ (function () {
    function DriverFactory() {
    }
    DriverFactory.getChromeDriver = function () {
        var service = new WebDriverChrome.ServiceBuilder(chromedriver.path).build(), options = new WebDriverChrome.Options();
        return WebDriverChrome.Driver.createSession(options, service);
    };
    DriverFactory.getFirefoxDriver = function () {
        var service = new WebDriverFirefox.ServiceBuilder(geckodriver.path).build(), options = new WebDriverFirefox.Options();
        return WebDriverFirefox.Driver.createSession(options, service);
    };
    DriverFactory.getDriver = function () {
        return this.getChromeDriver();
    };
    return DriverFactory;
}());
exports.DriverFactory = DriverFactory;
