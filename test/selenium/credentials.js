"use strict";
/**
 * Created by wert on 27.02.2018
 */
Object.defineProperty(exports, "__esModule", { value: true });
var Credentials = /** @class */ (function () {
    function Credentials() {
    }
    Credentials.baseUrl = 'http://app.squard.com:8080';
    Credentials.superadminBaseUrl = 'http://admin.squard.com:8080';
    Credentials.superadmin = {
        login: 'superadmin@squadintouch.com',
        password: 'superadmin'
    };
    return Credentials;
}());
exports.Credentials = Credentials;
