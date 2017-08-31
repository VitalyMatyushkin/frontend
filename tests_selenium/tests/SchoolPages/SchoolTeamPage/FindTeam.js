/**
 * Created by Vitaly on 13.06.17.
 */
const   test                = require('selenium-webdriver/testing'),
        SchoolPage          = require('../../../lib/Pages/SchoolPages/SchoolPage.js'),
        OftenUsed           = require('../../../lib/OftenUsed.js'),
        FindTeamTools       = require('../../../lib/Pages/SchoolPages/TeamTools/FindTeamTools.js'),
        Driver              = require('../../Driver.js');

const   timeout = 70000,
    team = {
        sport: ['Football', 'Hockey'],
        name: 'Test team',
        description: 'My team',
        gender: 'MIXED'
    },
    teamResult = {
        sport: 'Hockey',
        name: 'Test team',
        description: 'My team',
        gender: 'MIXED',
        ages: 'P5, P6'
    };

Promise.USE_PROMISE_MANAGER = false;

test.describe('Find team', function(){
    this.timeout(timeout);
    let driver;
    const   email = 'reference@squadintouch.com',
            pass = 'reference',
            role = 'ADMIN';

    test.before(async () => {
        driver = Driver.startDriver();
        await  SchoolPage.loginAndSelectRole(driver, email, pass, role);
    });

    test.it('Find team', async () => {
        let findTeam = new FindTeamTools(driver);
        await findTeam.visitTeamPage();
        await findTeam.openFilter();
        await findTeam.setSport(team.sport);
        await findTeam.setName(team.name);
        await findTeam.setDescription(team.description);
        await findTeam.setGender(team.gender);
        await findTeam.checkResult(teamResult);
    });

    test.after(async () => {
        await driver.quit()
    });
});

