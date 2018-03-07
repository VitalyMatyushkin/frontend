"use strict";
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
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var credentials_1 = require("../../credentials");
var driver_factory_1 = require("../../tools/driver_factory");
var login_page_1 = require("../../pages/superadmin/login_page");
var users_page_1 = require("../../pages/superadmin/users_page");
var user_create_page_1 = require("../../pages/superadmin/user_create_page");
var data_factory_1 = require("../../tools/data_factory");
/**
 * Created by wert on 04.03.2018
 */
describe.only('superadmin users page', function () {
    var driver;
    var baseUrl = credentials_1.Credentials.superadminBaseUrl, login = credentials_1.Credentials.superadmin.login, password = credentials_1.Credentials.superadmin.password;
    before(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    driver = driver_factory_1.DriverFactory.getDriver();
                    return [4 /*yield*/, driver.manage().timeouts().implicitlyWait(15000)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should be able to add new user', function () { return __awaiter(_this, void 0, void 0, function () {
        var loginPage, usersPage, usersPage2, userCreatePage, userEmail, userPassword, userPhone;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loginPage = new login_page_1.LoginPage(driver, baseUrl), usersPage = new users_page_1.UsersPage(driver, baseUrl), usersPage2 = new users_page_1.UsersPage(driver, baseUrl, '/#users'), userCreatePage = new user_create_page_1.UserCreatePage(driver, baseUrl);
                    userEmail = data_factory_1.getRandomEmail(), userPassword = data_factory_1.getDefaultPassword(), userPhone = data_factory_1.getRandomPhone();
                    return [4 /*yield*/, loginPage.login(login, password)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, usersPage.waitToBeOnPage()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, usersPage.clickAddUser()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, userCreatePage.waitToBeOnPage()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, userCreatePage.setFirstName('John')];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, userCreatePage.setLastName('TheTester')];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, userCreatePage.setGender('MALE')];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, userCreatePage.setPhone(userPhone)];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, userCreatePage.setEmail(userEmail)];
                case 9:
                    _a.sent();
                    return [4 /*yield*/, userCreatePage.setEmailConfirmation(userEmail)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, userCreatePage.setPassword(userPassword)];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, userCreatePage.setPasswordConfirmation(userPassword)];
                case 12:
                    _a.sent();
                    return [4 /*yield*/, userCreatePage.clickSubmit()];
                case 13:
                    _a.sent();
                    return [4 /*yield*/, usersPage2.waitToBeOnPage()];
                case 14:
                    _a.sent();
                    return [4 /*yield*/, usersPage2.clickFilterButton()];
                case 15:
                    _a.sent();
                    return [4 /*yield*/, usersPage2.setEmailFilter(userEmail)];
                case 16:
                    _a.sent();
                    true;
                    return [2 /*return*/];
            }
        });
    }); });
    it('should be able to edit user');
    it('should be able to find created user');
    after(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!driver) return [3 /*break*/, 2];
                    return [4 /*yield*/, driver.quit()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); });
});
