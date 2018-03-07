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
var LoginPage = /** @class */ (function (_super) {
    __extends(LoginPage, _super);
    function LoginPage(driver, baseUrl) {
        var _this = _super.call(this, driver, baseUrl, LoginPage.pagePath) || this;
        _this.inputEmailLocator = selenium_webdriver_1.By.id('login_email');
        _this.inputPassLocator = selenium_webdriver_1.By.id('login_password');
        _this.submitLoginLocator = selenium_webdriver_1.By.id('login_submit');
        _this.tryAgainButtonLocator = selenium_webdriver_1.By.id('tryAgain_button');
        _this.signUpButtonLocator = selenium_webdriver_1.By.id('signUp_button');
        return _this;
    }
    LoginPage.prototype.setEmail = function (email) {
        return __awaiter(this, void 0, void 0, function () {
            var emailInput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.driver.findElement(this.inputEmailLocator)];
                    case 1:
                        emailInput = _a.sent();
                        return [4 /*yield*/, emailInput.sendKeys(email)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.setPass = function (password) {
        return __awaiter(this, void 0, void 0, function () {
            var passwordInput;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.driver.findElement(this.inputPassLocator)];
                    case 1:
                        passwordInput = _a.sent();
                        return [4 /*yield*/, passwordInput.sendKeys(password)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.clickSubmit = function () {
        return __awaiter(this, void 0, void 0, function () {
            var submitButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.driver.findElement(this.submitLoginLocator)];
                    case 1:
                        submitButton = _a.sent();
                        return [4 /*yield*/, submitButton.click()];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.login = function (email, pass) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.visit()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.setEmail(email)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, this.setPass(pass)];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, this.clickSubmit()];
                }
            });
        });
    };
    LoginPage.prototype.clickTryAgain = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tryAgainButton;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        tryAgainButton = this.driver.findElement(this.tryAgainButtonLocator);
                        return [4 /*yield*/, tryAgainButton.click()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.prototype.isAuthorizationFailed = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tryAgainButtonPromise, signUpButtonPromise, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        tryAgainButtonPromise = this.driver.findElement(this.tryAgainButtonLocator), signUpButtonPromise = this.driver.findElement(this.signUpButtonLocator);
                        return [4 /*yield*/, Promise.all([tryAgainButtonPromise, signUpButtonPromise])];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, true];
                    case 2:
                        e_1 = _a.sent();
                        return [2 /*return*/, false];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LoginPage.pagePath = '/#login';
    return LoginPage;
}(page_1.Page));
exports.LoginPage = LoginPage;
