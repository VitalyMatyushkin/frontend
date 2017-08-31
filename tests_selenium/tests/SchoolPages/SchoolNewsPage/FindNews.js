/**
 * Created by Vitaly on 14.06.17.
 */

const   test                = require('selenium-webdriver/testing'),
        SchoolPage          = require('../../../lib/Pages/SchoolPages/SchoolPage.js'),
        OftenUsed           = require('../../../lib/OftenUsed.js'),
        NewsTools           = require('../../../lib/Pages/SchoolPages/NewsTools.js'),
        Driver              = require('../../Driver.js');

const   timeout = 70000,
        news = {
            title: 'News',
            dateFrom: '01012016',
            dateTo: '01012017'
        },
        newsResult = {
            title: 'News',
            date: '12 October 2016'
        };

Promise.USE_PROMISE_MANAGER = false;

test.describe('Find news', function(){
    this.timeout(timeout);
    let driver;
    const   email = 'reference@squadintouch.com',
            pass = 'reference',
            role = 'ADMIN';

    test.before(async () => {
        driver = Driver.startDriver();
        await  SchoolPage.loginAndSelectRole(driver, email, pass, role);
    });

    test.it('Find news', async () => {
        let toolsNews = new NewsTools(driver);
        await toolsNews.visitNewsPage();
        await toolsNews.openFilter();
        await toolsNews.setTitleFind(news.title);
        await toolsNews.setDateFrom(news.dateFrom);
        await toolsNews.setDateTo(news.dateTo);
        await toolsNews.checkResult(newsResult);
    });

    test.after(async () => {
        await driver.quit()
    });
});

