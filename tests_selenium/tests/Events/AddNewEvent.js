/**
 * Created by Vitaly on 22.06.17.
 */

const   test                = require('selenium-webdriver/testing'),
        OftenUsed           = require('../../lib/OftenUsed.js'),
        LoginPage           = require('../../lib/LoginPage.js'),
        EventTools          = require('../../lib/Pages/EventPages/EventTools'),
        Driver              = require('../Driver.js');

const   timeout = 70000,
        teamOneWithOnePlayer = {
            name: 'Test team first',
            players: ['Lori Pfannerstill']
        },
        teamTwoWithOnePlayer = {
            name: 'Test team second',
            players: ['Vincenzo Pollich']
        },
        teamOneWithTwoPlayers = {
            name: 'Test team first',
            players: ['Lori Pfannerstill','Vito Corleone']
        },
        teamTwoWithTwoPlayers = {
            name: 'Test team second',
            players: ['Vincenzo Pollich','Andreas Inesta']
        },
        teamOneWithThreePlayers = {
            name: 'Test team first',
            players: ['Lori Pfannerstill','Vito Corleone','Soll2 Soll2']
        },
        teamTwoWithThreePlayers = {
            name: 'Test team second',
            players: ['Vincenzo Pollich','Andreas Inesta']
        },
        event = {
            generalDate: {
                date: '29 June 2017',
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
                    name: 'Football',
                    type: 'Inter-schools',
                    distance: '40 miles',
                    schools: ['TBD'],
                    selectTeamLater: true,
                    selectTeams: false,
                    teams: false

                },
                {
                    kind: 'Team',
                    name: 'Football',
                    type: 'Inter-schools',
                    distance: '40 miles',
                    schools: ['TBD'],
                    selectTeamLater: false,
                    selectTeams: ['Football Boys Livingstone'],
                    teams: false
                },
                {
                    kind: 'Team',
                    name: 'Football',
                    type: 'Inter-schools',
                    distance: '40 miles',
                    schools: ['TBD'],
                    selectTeamLater: false,
                    selectTeams: false,
                    teams: [teamOneWithThreePlayers, teamTwoWithThreePlayers]
                },
                {
                    kind: 'Team',
                    name: 'Football',
                    type: 'Houses',
                    houses: ['Grenfell', 'Livingstone'],
                    selectTeamLater: true,
                    selectTeams: false,
                    teams: false
                },
                {
                    kind: 'Team',
                    name: 'Football',
                    type: 'Houses',
                    houses: ['Grenfell', 'Livingstone'],
                    selectTeamLater: false,
                    selectTeams: ['Football Boys Grenfell Clone', 'Football Boys Livingstone'],
                    teams: false
                },
                {
                    kind: 'Team',
                    name: 'Football',
                    type: 'Houses',
                    houses: ['Grenfell', 'Livingstone'],
                    selectTeamLater: false,
                    selectTeams: false,
                    teams: [teamOneWithThreePlayers, teamTwoWithThreePlayers]
                },
                {
                    kind: 'Team',
                    name: 'Football',
                    type: 'Internal',
                    selectTeamLater: false,
                    selectTeams: ['Football Boys Livingstone', 'New team'],
                    teams: false
                },
                {
                    kind: 'Team',
                    name: 'Football',
                    type: 'Internal',
                    selectTeamLater: true,
                    selectTeams: false,
                    teams: false
                },
                {
                    kind: 'Team',
                    name: 'Football',
                    type: 'Internal',
                    selectTeamLater: false,
                    selectTeams: false,
                    teams: [teamOneWithThreePlayers, teamTwoWithThreePlayers]
                },
                /**
                 * for individual
                 */
                {
                    kind: 'Individ',
                    name: 'Individual distance',
                    type: 'Internal',
                    selectTeamLater: true,
                    selectTeams: false,
                    teams: false
                },
                {
                    kind: 'Individ',
                    name: 'Individual distance',
                    type: 'Internal',
                    selectTeamLater: false,
                    selectTeams: false,
                    teams: [teamOneWithThreePlayers, teamTwoWithThreePlayers]
                },
                {
                    kind: 'Individ',
                    name: 'Individual distance',
                    type: 'Houses',
                    houses: ['Grenfell', 'Livingstone'],
                    selectTeamLater: true,
                    selectTeams: false,
                    teams: false
                },
                {
                    kind: 'Individ',
                    name: 'Individual distance',
                    type: 'Houses',
                    houses: ['Grenfell', 'Livingstone'],
                    selectTeamLater: false,
                    selectTeams: false,
                    teams: [teamOneWithThreePlayers, teamTwoWithThreePlayers]
                },
                {
                    kind: 'Individ',
                    name: 'Individual distance',
                    type: 'Inter-schools',
                    distance: '40 miles',
                    schools: ['TBD'],
                    selectTeamLater: true,
                    selectTeams: false,
                    teams: false
                },
                {
                    kind: 'Individ',
                    name: 'Individual distance',
                    type: 'Inter-schools',
                    distance: '40 miles',
                    schools: ['TBD'],
                    selectTeamLater: false,
                    selectTeams: false,
                    teams: [teamOneWithThreePlayers, teamTwoWithThreePlayers]
                },
                /**
                 * for 2x2
                 */
                {
                    kind: '2x2',
                    name: '2x2',
                    type: 'Inter-schools',
                    distance: '40 miles',
                    schools: ['TBD'],
                    selectTeamLater: true,
                    selectTeams: false,
                    teams: false
                },
                {
                    kind: '2x2',
                    name: '2x2',
                    type: 'Inter-schools',
                    distance: '40 miles',
                    schools: ['TBD'],
                    selectTeamLater: false,
                    selectTeams: ['2x2 Grenfell'],
                    teams: false
                },
                {
                    kind: '2x2',
                    name: '2x2',
                    type: 'Inter-schools',
                    distance: '40 miles',
                    schools: ['TBD'],
                    selectTeamLater: false,
                    selectTeams: false,
                    teams: [teamOneWithTwoPlayers, teamTwoWithTwoPlayers]
                },
                {
                    kind: '2x2',
                    name: '2x2',
                    type: 'Houses',
                    houses: ['Grenfell', 'Livingstone'],
                    selectTeamLater: true,
                    selectTeams: false,
                    teams: false
                },
                {
                    kind: '2x2',
                    name: '2x2',
                    type: 'Houses',
                    houses: ['Grenfell', 'Livingstone'],
                    selectTeamLater: false,
                    selectTeams: ['2x2 Grenfell', '2x2 Livingstone'],
                    teams: false
                },
                {
                    kind: '2x2',
                    name: '2x2',
                    type: 'Houses',
                    houses: ['Grenfell', 'Livingstone'],
                    selectTeamLater: false,
                    selectTeams: false,
                    teams: [teamOneWithTwoPlayers, teamTwoWithTwoPlayers]
                },
                {
                    kind: '2x2',
                    name: '2x2',
                    type: 'Internal',
                    selectTeamLater: false,
                    selectTeams: false,
                    teams: [teamOneWithTwoPlayers, teamTwoWithTwoPlayers]
                },
                {
                    kind: '2x2',
                    name: '2x2',
                    type: 'Internal',
                    selectTeamLater: false,
                    selectTeams: ['2x2 Grenfell', '2x2 Livingstone'],
                    teams: false
                },
                {
                    kind: '2x2',
                    name: '2x2',
                    type: 'Internal',
                    selectTeamLater: true,
                    selectTeams: false,
                    teams: false
                },
                /**
                 * for 1x1
                 */
                {
                    kind: '1x1',
                    name: '1x1',
                    type: 'Houses',
                    houses: ['Grenfell', 'Livingstone'],
                    selectTeamLater: true,
                    selectTeams: false,
                    teams: false
                },
                {
                    kind: '1x1',
                    name: '1x1',
                    type: 'Houses',
                    houses: ['Grenfell', 'Livingstone'],
                    selectTeamLater: false,
                    selectTeams: false,
                    teams: [teamOneWithOnePlayer, teamTwoWithOnePlayer]
                },
                {
                    kind: '1x1',
                    name: '1x1',
                    type: 'Internal',
                    selectTeamLater: true,
                    selectTeams: false,
                    teams: false
                },
                {
                    kind: '1x1',
                    name: '1x1',
                    type: 'Internal',
                    selectTeamLater: false,
                    selectTeams: false,
                    teams: [teamOneWithOnePlayer, teamTwoWithOnePlayer]
                },
                {
                    kind: '1x1',
                    name: '1x1',
                    type: 'Inter-schools',
                    distance: '40 miles',
                    schools: ['TBD'],
                    selectTeamLater: true,
                    selectTeams: false,
                    teams: false
                },
                {
                    kind: '1x1',
                    name: '1x1',
                    type: 'Inter-schools',
                    distance: '40 miles',
                    schools: ['TBD'],
                    selectTeamLater: false,
                    selectTeams: false,
                    teams: [teamOneWithOnePlayer, teamTwoWithOnePlayer]
                },
            ]
        };



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

	test.afterEach(async () => {
		await driver.quit();
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
                    await eventTools.setEventSchools(game.schools);
                    postCodeIndex = 2;
                    await eventTools.setEventPostcode(event.generalDate.postcode, postCodeIndex);
                    await eventTools.clickContinue();
                    await eventTools.checkTeamManagerPage();
                    await eventTools.selectPlayersIfInterSchoolType(game.selectTeamLater, game.selectTeams, game.teams, game.kind);
                    await eventTools.checkCompleteCreatePage();
                    break;
                case 'Houses':
                    await eventTools.setEventHouses(game.houses);
                    postCodeIndex= 3;
                    await eventTools.setEventPostcode(event.generalDate.postcode, postCodeIndex);
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
        });
    }
});

