"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var selenium_webdriver_1 = require("selenium-webdriver");
var page_1 = require("../page");
var slow_typer_1 = require("../../tools/slow_typer");
/**
 * Created by wert on 05.03.2018
 */
var UserCreatePage = /** @class */ (function (_super) {
    __extends(UserCreatePage, _super);
    function UserCreatePage(driver, baseUrl) {
        var _this = _super.call(this, driver, baseUrl, UserCreatePage.pagePath) || this;
        _this.firstNameInputLocator = selenium_webdriver_1.By.id('firstname_input');
        _this.lastNameInputLocator = selenium_webdriver_1.By.id('lastname_input');
        _this.maleGenderInputLocator = selenium_webdriver_1.By.id('gender_input_0');
        _this.femaleGenderInputLocator = selenium_webdriver_1.By.id('gender_input_1');
        _this.phonePrefixLocator = selenium_webdriver_1.By.id('select_phone_prefix');
        _this.phoneInputLocator = selenium_webdriver_1.By.id('phone_input');
        _this.emailInputLocator = selenium_webdriver_1.By.id('email_input');
        _this.emailConfirmInputLocator = selenium_webdriver_1.By.id('email_input_2');
        _this.passwordInputLocator = selenium_webdriver_1.By.id('password_input');
        _this.passwordConfirmInputLocator = selenium_webdriver_1.By.id('password_input_2');
        _this.maxIosSessionCountInputLocator = selenium_webdriver_1.By.id('maxIosSessionCount_input');
        _this.maxAndroidSessionCountInputLocator = selenium_webdriver_1.By.id('maxAndroidSessionCount_input');
        _this.maxWebSessionCountInputLocator = selenium_webdriver_1.By.id('maxWebSessionCount_input');
        _this.submitButtonLocator = selenium_webdriver_1.By.id('createUser_submit');
        _this.cancelButtonLocator = selenium_webdriver_1.By.id('createUser_cancel');
        return _this;
    }
    UserCreatePage.prototype.setFirstName = function (firstName) {
        return this.driver.findElement(this.firstNameInputLocator).sendKeys(firstName);
    };
    UserCreatePage.prototype.setLastName = function (lastName) {
        return this.driver.findElement(this.lastNameInputLocator).sendKeys(lastName);
    };
    UserCreatePage.prototype.setGender = function (gender) {
        if (gender === 'MALE') {
            return this.driver.findElement(this.maleGenderInputLocator).click();
        }
        else {
            return this.driver.findElement(this.femaleGenderInputLocator).click();
        }
    };
    UserCreatePage.prototype.setPhone = function (fullPhone) {
        return __awaiter(this, void 0, void 0, function () {
            var phoneBody, phoneBody;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!fullPhone.startsWith('+7')) return [3 /*break*/, 2];
                        phoneBody = fullPhone.substr('+7'.length);
                        return [4 /*yield*/, this.driver.findElement(selenium_webdriver_1.By.css('#select_phone_prefix>option[value=\'+7\']')).click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, slow_typer_1.slowTyper(this.driver, this.driver.findElement(this.phoneInputLocator), phoneBody)];
                    case 2:
                        if (!fullPhone.startsWith('+44')) return [3 /*break*/, 4];
                        phoneBody = fullPhone.substr('+44'.length);
                        return [4 /*yield*/, this.driver.findElement(selenium_webdriver_1.By.css('#select_phone_prefix>option[value=\'+44\']')).click()];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, slow_typer_1.slowTyper(this.driver, this.driver.findElement(this.phoneInputLocator), phoneBody)];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    UserCreatePage.prototype.setEmail = function (email) {
        return this.driver.findElement(this.emailInputLocator).sendKeys(email);
    };
    UserCreatePage.prototype.setEmailConfirmation = function (email) {
        return this.driver.findElement(this.emailConfirmInputLocator).sendKeys(email);
    };
    UserCreatePage.prototype.setPassword = function (password) {
        return this.driver.findElement(this.passwordInputLocator).sendKeys(password);
    };
    UserCreatePage.prototype.setPasswordConfirmation = function (password) {
        return this.driver.findElement(this.passwordConfirmInputLocator).sendKeys(password);
    };
    UserCreatePage.prototype.setMaxIosSessionCount = function (n) {
        return this.driver.findElement(this.maxIosSessionCountInputLocator).sendKeys(n);
    };
    UserCreatePage.prototype.setMaxAndroidSessionCount = function (n) {
        return this.driver.findElement(this.maxAndroidSessionCountInputLocator).sendKeys(n);
    };
    UserCreatePage.prototype.setMaxWebSessionCount = function (n) {
        return this.driver.findElement(this.maxWebSessionCountInputLocator).sendKeys(n);
    };
    UserCreatePage.prototype.clickSubmit = function () {
        return this.driver.findElement(this.submitButtonLocator).click();
    };
    UserCreatePage.pagePath = '/#users/admin_views/create_user';
    return UserCreatePage;
}(page_1.Page));
exports.UserCreatePage = UserCreatePage;
