/**
 * Created by Vitaly on 16.06.17.
 */
const   test                = require('selenium-webdriver/testing'),
        SchoolPage          = require('../../../lib/Pages/SchoolPages/SchoolPage.js'),
        OftenUsed           = require('../../../lib/OftenUsed.js'),
        GalleryTools        = require('../../../lib/Pages/SchoolPages/GalleryTools.js'),
        Driver              = require('../../Driver.js');

const   timeout = 70000;

Promise.USE_PROMISE_MANAGER = false;

test.describe('Delete album', function(){
    this.timeout(timeout);
    let driver;
    const   email = 'reference@squadintouch.com',
            pass = 'reference',
            role = 'ADMIN';

    test.before(async () => {
        driver = Driver.startDriver();
        await  SchoolPage.loginAndSelectRole(driver, email, pass, role);
    });

    test.it('Delete album', async () => {
        let gallery = new GalleryTools(driver);
        await gallery.visitGallery();
        await gallery.deleteClick();
    });

    test.after(async () => {
        await driver.quit()
    });
});


