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
        newsFind = {
            title: 'NewsTest',
            dateFrom: '01012016',
            dateTo: '01072017'
        },
        newsFindCheck = {
            title: 'NewsTest',
            date: '14 June 2017'
        },
        news = {
            title: 'NewsTest',
            date: '14.06.2017',
            text: 'Trololo lolo',
            filePath: Constants.imagePath
        },
        newsEditFind = {
            title: 'NewsTest',
            dateFrom: '01012016',
            dateTo: '01072017'
        },
        newsEditCheck = {
            title: 'NewsTest',
            date: '14 June 2017'
        };

Promise.USE_PROMISE_MANAGER = false;

test.describe('Edit news', function(){
    this.timeout(timeout);
    let driver;
    const   email = 'reference@squadintouch.com',
            pass = 'reference',
            role = 'ADMIN';

    test.before(async () => {
        driver = Driver.startDriver();
        await  SchoolPage.loginAndSelectRole(driver, email, pass, role);
    });

    test.it('Edit news', async () => {
        let toolsNews = new NewsTools(driver);
        await toolsNews.findNews(newsFind);
        let resultLine = await toolsNews.checkResult(newsFindCheck);

        await toolsNews.editClick(resultLine);
        await toolsNews.checkEditPage();
        await toolsNews.editTitle(news.title);
        await toolsNews.editDate(news.date);
        await toolsNews.editText(news.text);
        await toolsNews.setImage(news.filePath);
        await toolsNews.submit();

        await toolsNews.findNews(newsEditFind);
        await toolsNews.checkResult(newsEditCheck);
    });

    test.after(async () => {
        await driver.quit()
    });
});

