/**
 * Created by Vitaly on 13.06.17.
 */
const   test                = require('selenium-webdriver/testing'),
        SchoolPage          = require('../../../lib/Pages/SchoolPages/SchoolPage.js'),
        OftenUsed           = require('../../../lib/OftenUsed.js'),
        AddTeamTools        = require('../../../lib/Pages/SchoolPages/TeamTools/AddTeamTools.js'),
        FindTeamTools       = require('../../../lib/Pages/SchoolPages/TeamTools/FindTeamTools.js'),
        Driver              = require('../../Driver.js');

const   timeout = 70000,
        newTeam = {
            name: 'Test team',
            description: 'My team',
            game: 'Hockey',
            gender: 'Mixed', //Girls only, Boys only
            ages: ['P5', 'P6'],
            house: 'Grenfell',
            players: [
                'Lori Pfannerstill',
                'Soll Soll'
            ]
        },
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
        };

Promise.USE_PROMISE_MANAGER = false;

test.describe('Add new team', function(){
    this.timeout(timeout);
    let driver;
    const   email = 'reference@squadintouch.com',
            pass = 'reference',
            role = 'ADMIN';

    test.before(async () => {
        driver = Driver.startDriver();
        await  SchoolPage.loginAndSelectRole(driver, email, pass, role);
    });

    test.it('Add team', async () => {
        let addTeam = new AddTeamTools(driver);
        await addTeam.visitAddTeamPage();
        await addTeam.setName(newTeam.name);
        await addTeam.setDescription(newTeam.description);
        await addTeam.setGame(newTeam.game);
        await addTeam.setGender(newTeam.gender);
        await addTeam.setAges(newTeam.ages);

        await addTeam.filteredByHouse(newTeam.house);
        await addTeam.addPlayers(newTeam.players);
        await addTeam.checkCaptain();
        await addTeam.submit();

        let findTeam = new FindTeamTools(driver);
        await findTeam.findTeam(teamFind);
        await findTeam.checkResult(teamFindCheck);
    });

    test.after(async () => {
        await driver.quit()
    });
});


