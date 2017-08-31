/**
 * Created by Vitaly on 15.06.17.
 */
const   test                = require('selenium-webdriver/testing'),
        SchoolPage          = require('../../../lib/Pages/SchoolPages/SchoolPage.js'),
        OftenUsed           = require('../../../lib/OftenUsed.js'),
        GalleryTools        = require('../../../lib/Pages/SchoolPages/GalleryTools.js'),
        Driver              = require('../../Driver.js'),
        Constants           = require('../../../lib/Constants.js');


const   timeout = 70000;

Promise.USE_PROMISE_MANAGER = false;

test.describe('Set album cover', function(){
    this.timeout(timeout);
    let driver;
    const   email = 'reference@squadintouch.com',
            pass = 'reference',
            role = 'ADMIN';

    test.before(async () => {
        driver = Driver.startDriver();
        await  SchoolPage.loginAndSelectRole(driver, email, pass, role);
    });

    test.it('Set album cover', async () => {
        let gallery = new GalleryTools(driver);
        await gallery.visitGallery();
        await gallery.clickAlbumViewAndCheck();
        await gallery.setAlbumCover();
    });

    test.after(async () => {
        await driver.quit()
    });
});


