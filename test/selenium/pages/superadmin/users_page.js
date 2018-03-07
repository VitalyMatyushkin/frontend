"use strict";
/**
 * Created by wert on 27.02.2018
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var selenium_webdriver_1 = require("selenium-webdriver");
var page_1 = require("../page");
var UsersPage = /** @class */ (function (_super) {
    __extends(UsersPage, _super);
    function UsersPage(driver, baseUrl, pagePath) {
        if (pagePath === void 0) { pagePath = UsersPage.pagePath; }
        var _this = _super.call(this, driver, baseUrl, pagePath) || this;
        _this.addUserButtonLocator = selenium_webdriver_1.By.id('addUser_button');
        _this.gridFilterButtonLocator = selenium_webdriver_1.By.id('gridFilter_button');
        _this.gridFilterEmailInput = selenium_webdriver_1.By.id('userEmailFilter_input');
        return _this;
    }
    UsersPage.prototype.clickAddUser = function () {
        return this.driver.findElement(this.addUserButtonLocator).click();
    };
    UsersPage.prototype.clickFilterButton = function () {
        // this part should be moved to "models"
        // grids should are working almost the same way, so need to move it to grid model test component
        // but a bit later
        return this.driver.findElement(this.gridFilterButtonLocator).click();
    };
    UsersPage.prototype.setEmailFilter = function (email) {
        return this.driver.findElement(this.gridFilterEmailInput).sendKeys(email);
    };
    UsersPage.pagePath = '/#users/users';
    return UsersPage;
}(page_1.Page));
exports.UsersPage = UsersPage;
