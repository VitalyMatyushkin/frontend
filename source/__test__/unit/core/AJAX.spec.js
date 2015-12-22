/**
 * Created by wert on 08.12.15.
 */

var AJAX = require('module/core/AJAX');

describe("AJAX", () => {
    it("should call valid URL and get success promise as result", () => {
        return AJAX({
            url: "http://testing.squard.com:9876/base/build/js/bower/classnames/index.js",
            method: "GET"
        }).then((data) => {
            expect(data).to.be.a('string');
        });
    });
});