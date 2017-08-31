/**
 * Created by Vitaly on 14.06.17.
 */
const   test                = require('selenium-webdriver/testing'),
        SchoolPage          = require('../../../lib/Pages/SchoolPages/SchoolPage.js'),
        OftenUsed           = require('../../../lib/OftenUsed.js'),
        NewsTools           = require('../../../lib/Pages/SchoolPages/NewsTools.js'),
        Driver              = require('../../Driver.js'),
        Constants           = require('../../../lib/Constants.js');

const   timeout = 70000,
        news = {
            title: 'NewsTest',
            date: '14.06.2017',
            text: 'Trololo lolo',
            filePath: Constants.imagePath
        },
        newsFind = {
            title: 'NewsTest',
            dateFrom: '01012016',
            dateTo: '01072017'
        },
        newsFindCheck = {
            title: 'NewsTest',
            date: '14 June 2017'
        };

Promise.USE_PROMISE_MANAGER = false;

test.describe('Add news', function(){
    this.timeout(timeout);
    let driver;
    const   email = 'reference@squadintouch.com',
            pass = 'reference',
            role = 'ADMIN';

    test.before(async () => {
        driver = Driver.startDriver();
        await  SchoolPage.loginAndSelectRole(driver, email, pass, role);
    });

    test.it('Add news', async () => {
        let toolsNews = new NewsTools(driver);
        await toolsNews.visitAddNewsPage();
        await toolsNews.setTitle(news.title);
        await toolsNews.setDate(news.date);
        await toolsNews.setText(news.text);
        await toolsNews.setImage(news.filePath);
        await toolsNews.submit();

        await toolsNews.findNews(newsFind);
        await toolsNews.checkResult(newsFindCheck);
    });

    test.after(async () => {
        await driver.quit()
    });
});


