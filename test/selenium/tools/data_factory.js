"use strict";
/**
 * Created by wert on 06.03.2018
 */
Object.defineProperty(exports, "__esModule", { value: true });
var numeric = '0123456789', alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', alphanumeric = alpha + numeric;
function makeId(length, dictionary) {
    if (dictionary === void 0) { dictionary = alphanumeric; }
    var text = "";
    for (var i = 0; i < length; i++)
        text += dictionary.charAt(Math.floor(Math.random() * dictionary.length));
    return text;
}
function getRandomEmail(optDomain) {
    if (optDomain === void 0) { optDomain = 'fakemail.squadintouch.com'; }
    var randomPart = Date.now() + "__" + makeId(6);
    return "selenium_test_email_" + randomPart + "@" + optDomain;
}
exports.getRandomEmail = getRandomEmail;
function getDefaultPassword() {
    return '111111Ab';
}
exports.getDefaultPassword = getDefaultPassword;
function getRandomPhone() {
    var suffix = '' + Date.now() + makeId(5, numeric);
    return '+7900000000000#' + suffix;
}
exports.getRandomPhone = getRandomPhone;
