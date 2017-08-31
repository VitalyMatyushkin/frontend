/**
 * Created by Vitaly on 14.06.17.
 */

const   test                = require('selenium-webdriver/testing'),
        SchoolPage          = require('../../../lib/Pages/SchoolPages/SchoolPage.js'),
        OftenUsed           = require('../../../lib/OftenUsed.js'),
        EditTeamTools        = require('../../../lib/Pages/SchoolPages/TeamTools/EditTeamTools.js'),
        FindTeamTools       = require('../../../lib/Pages/SchoolPages/TeamTools/FindTeamTools.js'),
        Driver              = require('../../Driver.js');

const   timeout = 70000,
        teamFind = {
            sport: ['Football', 'Hockey'],
            name: 'Test team',
            description: 'My team',
            gender: 'MIXED'
        },
        teamFindCheck = {
            sport: 'Hockey',
            name: 'Test team',
            description: 'My team',
            gender: 'MIXED',
            ages: 'P5, P6'
        },
        team = {
            name: 'Test team',
            description: 'My team',
            game: 'Hockey',
            gender: 'Mixed', //Girls only, Boys only
            ages: ['P5', 'P6'],
            house: 'Grenfell',
            playersAdd: [
                'Vito Corleone',
                'Lori Pfannerstill'
            ],
            playersRemove: [
                'Lori Pfannerstill'
            ],
        },
        teamEditFind = {
            sport: ['Football', 'Hockey'],
            name: 'Test team',
            description: 'My team',
            gender: 'MIXED'
        },
        teamEditCheck = {
            sport: 'Hockey',
            name: 'Test team',
            description: 'My team',
            gender: 'MIXED',
            ages: 'P5, P6'
        };

Promise.USE_PROMISE_MANAGER = false;

test.describe('Edit team', function(){
    this.timeout(timeout);
    let driver;
    const   email = 'reference@squadintouch.com',
            pass = 'reference',
            role = 'ADMIN';

    test.before(async () => {
        driver = Driver.startDriver();
        await  SchoolPage.loginAndSelectRole(driver, email, pass, role);
    });

    test.it('Edit team', async () => {
        let findTeam = new FindTeamTools(driver);
        await findTeam.findTeam(teamFind);
        let resultLine = await findTeam.checkResult(teamFindCheck);

        let editTeam = new EditTeamTools(driver);
        await editTeam.editClick(resultLine);
        await editTeam.checkEditPage();
        await editTeam.editName(team.name);
        await editTeam.editDescription(team.description);
        await editTeam.editGame(team.game);
        await editTeam.editGender(team.gender);
        await editTeam.editAges(team.ages);
        await editTeam.editFilteredByHouse(team.house);
        await editTeam.addPlayers(team.playersAdd);
        await editTeam.deletePlayers(team.playersRemove);
        await editTeam.checkCaptain();
        await editTeam.checkSub();
        await editTeam.submit();

        await findTeam.findTeam(teamEditFind);
        await findTeam.checkResult(teamEditCheck);
    });

    test.after(async () => {
        await driver.quit()
    });
});

