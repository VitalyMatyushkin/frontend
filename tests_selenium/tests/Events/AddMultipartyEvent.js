/**
 * Created by Vitaly on 05.07.17.
 */

const   test                = require('selenium-webdriver/testing'),
        OftenUsed           = require('../../lib/OftenUsed.js'),
        LoginPage           = require('../../lib/LoginPage.js'),
        EventTools          = require('../../lib/Pages/EventPages/EventTools'),
        Driver              = require('../Driver.js');

const   timeout = 70000,
        teamGrenfell = {
            name: 'Test team Grenfell',
            players: ['Lori Pfannerstill', 'Vito Corleone']
        },
        teamLivingstone = {
            name: 'Test team Livingstone',
            players: ['Andreas Inesta', 'Vincenzo Pollich']
        },
        teamHouse = {
            name: 'Test team House',
            players: ['Damon George', 'Camron Henry']
        },
        event = {
            generalDate: {
                date: '29 July 2017',
                time: '16:00',
                showAllSport: true,
                gender: 'BOYS',
                ages: ['P1', 'P2', 'P3', 'P5', 'P6','P7', 'S1', 'S2'],
                postcode: 'Test2 (AB10 1AA)'
            },
            game: [
                /**
                 * For team
                 */
                {
                    kind: 'Team',
                    name: 'TestMultipartyTeam',
                    type: 'Inter-schools',
                    distance: '40 miles',
                    schools: ['TBD', 'DistTestSchool10-01_9.3', 'Handcross Park School'],
                    selectTeamLater: false,
                    selectTeams: ['Test Livingstone'],
                    teams: false
                },
                {
                    kind: 'Team',
                    name: 'TestMultipartyTeam',
                    type: 'Inter-schools',
                    distance: '40 miles',
                    schools: ['TBD', 'DistTestSchool10-01_9.3', 'Handcross Park School'],
                    selectTeamLater: false,
                    selectTeams: false,
                    teams: [teamLivingstone]
                },
                {
                    kind: 'Team',
                    name: 'TestMultipartyTeam',
                    type: 'Houses',
                    houses: ['Grenfell', 'Livingstone', 'Stark', 'House'],
                    selectTeamLater: true,
                    selectTeams: false,
                    teams: false
                },
                {
                    kind: 'Team',
                    name: 'TestMultipartyTeam',
                    type: 'Houses',
                    houses: ['Grenfell', 'Livingstone', 'House'],
                    selectTeamLater: false,
                    selectTeams: ['Test Grenfell', 'Test Livingstone', 'Test House'],
                    teams: false
                },
                {
                    kind: 'Team',
                    name: 'TestMultipartyTeam',
                    type: 'Houses',
                    houses: ['Grenfell', 'Livingstone', 'House'],
                    selectTeamLater: false,
                    selectTeams: false,
                    teams: [teamGrenfell, teamLivingstone, teamHouse]
                },
                {
                    kind: 'Team',
                    name: 'TestMultipartyTeam',
                    type: 'Internal',
                    selectTeamLater: false,
                    selectTeams: ['Test Grenfell', 'Test Livingstone', 'Test House'],
                    teams: false
                },
                {
                    kind: 'Team',
                    name: 'TestMultipartyTeam',
                    type: 'Internal',
                    selectTeamLater: false,
                    selectTeams: false,
                    teams: [teamGrenfell, teamLivingstone, teamHouse]
                },
                /**
                 * For 2x2
                 */
                {
                    kind: '2x2',
                    name: 'TestMultiparty2x2',
                    type: 'Houses',
                    houses: ['Grenfell', 'Livingstone', 'Stark', 'House'],
                    selectTeamLater: true,
                    selectTeams: false,
                    teams: false
                },
                {
                    kind: '2x2',
                    name: 'TestMultiparty2x2',
                    type: 'Inter-schools',
                    distance: '40 miles',
                    schools: ['TBD', 'DistTestSchool10-01_9.3', 'Handcross Park School'],
                    selectTeamLater: false,
                    selectTeams: ['Test Livingstone 2x2'],
                    teams: false
                },
                {
                    kind: '2x2',
                    name: 'TestMultiparty2x2',
                    type: 'Inter-schools',
                    distance: '40 miles',
                    schools: ['TBD', 'DistTestSchool10-01_9.3', 'Handcross Park School'],
                    selectTeamLater: false,
                    selectTeams: false,
                    teams: [teamLivingstone]
                },
                {
                    kind: '2x2',
                    name: 'TestMultiparty2x2',
                    type: 'Houses',
                    houses: ['Grenfell', 'Livingstone', 'House'],
                    selectTeamLater: false,
                    selectTeams: ['Test Grenfell 2x2', 'Test Livingstone 2x2', 'Test House 2x2'],
                    teams: false
                },
                {
                    kind: '2x2',
                    name: 'TestMultiparty2x2',
                    type: 'Houses',
                    houses: ['Grenfell', 'Livingstone', 'House'],
                    selectTeamLater: false,
                    selectTeams: false,
                    teams: [teamGrenfell, teamLivingstone, teamHouse]
                },
                {
                    kind: '2x2',
                    name: 'TestMultiparty2x2',
                    type: 'Internal',
                    selectTeamLater: false,
                    selectTeams: ['Test Grenfell 2x2', 'Test Livingstone 2x2', 'Test House 2x2'],
                    teams: false
                },
                {
                    kind: '2x2',
                    name: 'TestMultiparty2x2',
                    type: 'Internal',
                    selectTeamLater: false,
                    selectTeams: false,
                    teams: [teamGrenfell, teamLivingstone, teamHouse]
                },
                /**
                 * For individual
                 */
                {
                    kind: 'Individ',
                    name: 'Individual Multiparty',
                    type: 'Inter-schools',
                    distance: '40 miles',
                    schools: ['TBD', 'DistTestSchool10-01_9.3', 'Handcross Park School'],
                    selectTeamLater: false,
                    selectTeams: false,
                    teams: [teamLivingstone]
                },
                {
                    kind: 'Individ',
                    name: 'Individual Multiparty',
                    type: 'Houses',
                    houses: ['Grenfell', 'Livingstone'],
                    selectTeamLater: true,
                    selectTeams: false,
                    teams: false
                },
                {
                    kind: 'Individ',
                    name: 'Individual Multiparty',
                    type: 'Houses',
                    houses: ['Grenfell', 'Livingstone'],
                    selectTeamLater: false,
                    selectTeams: false,
                    teams: [teamGrenfell, teamLivingstone]
                },
        ]};

Promise.USE_PROMISE_MANAGER = false;

test.describe('Add new event', function(){
    this.timeout(timeout);
    let driver,
        email = 'reference@squadintouch.com',
        pass = 'reference',
        role = 'ADMIN',
        postCodeIndex;

    test.beforeEach(async () => {
        driver = Driver.startDriver();
        await  LoginPage.loginAndSelectRole(driver, email, pass, role);
    });

    for (let game of event.game) {
        let selectTeam = '';
        if (game.selectTeamLater)
            selectTeam = 'select team later';
        else {
            if (game.selectTeams)
                selectTeam = 'select teams';
            else
                selectTeam = 'players was added to team';
        }
        test.it('Event: ' + game.kind + ', ' + game.type + ', ' + selectTeam, async () => {
            let eventTools = new EventTools(driver);
            await eventTools.clickAddEventAndCheckPage();
            await eventTools.setEventDate(event.generalDate.date);
            await eventTools.setEventTime(event.generalDate.time);
            await eventTools.setEventGame(game.name, event.generalDate.showAllSport);
            await eventTools.setEventGender(event.generalDate.gender);
            await eventTools.setEventAges(event.generalDate.ages);
            await eventTools.setEventGameType(game.type);
            switch (game.type) {
                case 'Inter-schools':
                    await eventTools.setDistance(game.distance);
                    let indexPostSchool = await eventTools.setEventSchools(game.schools);
                    await eventTools.setEventPostcode(event.generalDate.postcode, indexPostSchool + 2);
                    await eventTools.clickContinue();
                    await eventTools.checkTeamManagerPage();
                    await eventTools.selectPlayersIfInterSchoolType(game.selectTeamLater, game.selectTeams, game.teams, game.kind);
                    await eventTools.checkCompleteCreatePage();
                    break;
                case 'Houses':
                    let indexPostHouse = await eventTools.setEventHouses(game.houses) + 2;
                    if (game.kind === 'Individ'){
                        indexPostHouse = 3;
                    }
                    await eventTools.setEventPostcode(event.generalDate.postcode, indexPostHouse);
                    await eventTools.clickContinue();
                    await eventTools.checkTeamManagerPage();
                    await eventTools.selectPlayersIfHousesType(game.selectTeamLater, game.selectTeams, game.teams, game.kind);
                    await eventTools.checkCompleteCreatePage();
                    break;
                case 'Internal':
                    postCodeIndex= 1;
                    await eventTools.setEventPostcode(event.generalDate.postcode, postCodeIndex);
                    await eventTools.clickContinue();
                    await eventTools.checkTeamManagerPage();
                    await eventTools.selectPlayersIfInternalType(game.selectTeamLater, game.selectTeams, game.teams, game.kind);
                    await eventTools.checkCompleteCreatePage();
                    break;
            }
            await driver.quit()
        });
    }
});