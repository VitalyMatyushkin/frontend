"use strict";
/**
 * Created by wert on 28.02.2018
 */
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
var Page = /** @class */ (function () {
    function Page(driver, baseUrl, pagePath) {
        this.driver = driver;
        this.fullUrl = baseUrl + pagePath;
    }
    Page.prototype.getImplicitWaitTimeout = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, implicit, pageLoad, script;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.driver.manage().getTimeouts()];
                    case 1:
                        _a = _b.sent(), implicit = _a.implicit, pageLoad = _a.pageLoad, script = _a.script;
                        return [2 /*return*/, implicit];
                }
            });
        });
    };
    /**
     * check whether browser is on this page.
     * This page determined by `fillUrl` property.
     * Check performed in Selenium way: it performs check multiple times during some waiting time.
     * If during this time browser not redirected to given page false will be returned.
     * If you need to throw exception see {Page.waitToBeOnPage}
     * @param optTimeout optional explicit timeout to wait for
     * @return {Promise<boolean>}
     */
    Page.prototype.isOnPage = function (optTimeout) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var timeout, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!optTimeout) return [3 /*break*/, 1];
                        _a = optTimeout;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.getImplicitWaitTimeout()];
                    case 2:
                        _a = _b.sent();
                        _b.label = 3;
                    case 3:
                        timeout = _a;
                        return [2 /*return*/, this.driver.wait(function () { return __awaiter(_this, void 0, void 0, function () {
                                var currentUrl;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.driver.getCurrentUrl()];
                                        case 1:
                                            currentUrl = _a.sent();
                                            return [2 /*return*/, currentUrl === this.fullUrl];
                                    }
                                });
                            }); }, timeout).then(function () { return true; }, function () { return false; })];
                }
            });
        });
    };
    /**
     * Check whether browser is on page. If during timeout browser will not visit given page timeout exception will be thrown
     * @param {number} optTimeout
     * @return {Promise<void>}
     */
    Page.prototype.waitToBeOnPage = function (optTimeout) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var timeout, _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!optTimeout) return [3 /*break*/, 1];
                        _a = optTimeout;
                        return [3 /*break*/, 3];
                    case 1: return [4 /*yield*/, this.getImplicitWaitTimeout()];
                    case 2:
                        _a = _b.sent();
                        _b.label = 3;
                    case 3:
                        timeout = _a;
                        return [2 /*return*/, this.driver.wait(function () { return __awaiter(_this, void 0, void 0, function () {
                                var currentUrl;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, this.driver.getCurrentUrl()];
                                        case 1:
                                            currentUrl = _a.sent();
                                            return [2 /*return*/, currentUrl === this.fullUrl];
                                    }
                                });
                            }); }, timeout).then(function () { return void 0; })];
                }
            });
        });
    };
    /**
     * redirects browser to page specified as `fullUrl` class property
     * @param {number} optTimeout
     * @return {Promise<string>} string with full url in case of success
     */
    Page.prototype.visit = function (optTimeout) {
        return __awaiter(this, void 0, void 0, function () {
            var isOnPage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.driver.get(this.fullUrl)];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, this.isOnPage(optTimeout)];
                    case 2:
                        isOnPage = _a.sent();
                        if (isOnPage) {
                            return [2 /*return*/, this.fullUrl];
                        }
                        else {
                            throw new Error("url not found: " + this.fullUrl);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return Page;
}());
exports.Page = Page;
