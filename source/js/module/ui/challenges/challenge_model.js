/**
 * Created by Anatoly on 28.03.2016.
 */
const   DateHelper  = require('module/helpers/date_helper'),
        EventHelper = require('module/helpers/eventHelper'),
        TeamHelper  = require('./../managers/helpers/team_helper');

const ChallengeModel = function(event, activeSchoolId){
    const self = this;

    self.activeSchoolId = activeSchoolId;
    self.id = event.id;
    self.name = event.name;
    self.played = event.status === 'FINISHED';
    self.sport = event.sport ? event.sport.name : '';
    self.date = DateHelper.getDate(event.startTime);
    self.time = DateHelper.getTime(event.startTime);
    self.rivals = self._getRivals(event, activeSchoolId);
    self.score = self._getScore(event, activeSchoolId);
};

ChallengeModel.prototype._getResultByTeam = function(event, order) {
    const   self = this,
            participant = order < event.teamsData.length ? event.teamsData[order] : null;

    let goal = '-';

    if (self.played) {
        const foundResult = event.results.teamScore.find(t => t.teamId === participant.id);

        goal = foundResult ? foundResult.score : 0;
    }

    return goal;
};

ChallengeModel.prototype._getRivalName = function(event, order) {
    const   self        = this,
            eventType   = event.eventType,
            played      = self.played,
            participant = order < event.teamsData.length ? event.teamsData[order] : null;

    const result = {};

    // set name
    // sport type is important
    switch(EventHelper.serverEventTypeToClientEventTypeMapping[eventType]) {
        case 'internal':
            result.id      = participant ? participant.id : null;
            result.name    = participant ? participant.name : null;
            break;
        case 'houses':
            if(TeamHelper.isNonTeamSport(event)) {
                result.id   = event.housesData[order].id;
                result.name = event.housesData[order].name;
            } else {
                result.id   = participant ? participant.id : null;
                result.name = participant && participant.house ? participant.house.name : null;
            }
            break;
        case 'inter-schools':
            // TODO OMFG!
            if(TeamHelper.isNonTeamSport(event)) {
                switch (order) {
                    case 0:
                        // i don't what is order, but let order 0 is active school and order 1 is invited school
                        result.id   = event.inviterSchool.id;
                        result.name = event.inviterSchool.name;
                        break;
                    case 1:
                        result.id      = event.invitedSchools[0].id;
                        result.name    = event.invitedSchools[0].name;
                        break;
                }
            } else {
                if(participant && self.activeSchoolId == participant.schoolId && participant.name) {
                    result.id      = participant.id;
                    result.name    = participant.name;
                } else {
                    result.id      = participant === null ? event.invitedSchools[0].id : participant.id;
                    result.name    = event.inviterSchool.id !== self.activeSchoolId ?
                        event.inviterSchool.name :
                        event.invitedSchools[0].name;
                }
            }
            break;
    }

    // set scores
    if (!result.name) {
        result.name = 'n/a';
    }
    else if (played && result.name && !TeamHelper.isNonTeamSport(event)) {
        let goal = self._getResultByTeam(event, order);
        result.name += '[' + goal + ']';
    }

    return result;
};

ChallengeModel.prototype._getFirstIndex = function(event, activeSchoolId){
    const activeIndex = event.teamsData.findIndex(participant => participant.schoolId === activeSchoolId);

    return (
        event.eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
        event.teamsData.length > 1 &&
        activeIndex >= 0 ? activeIndex : 0
    );
};

ChallengeModel.prototype._getRivals = function(event, activeSchoolId){
    const self = this,
        firstIndex = self._getFirstIndex(event, activeSchoolId),
        secondIndex = 1-firstIndex,
        rivals = [];

    rivals.push(self._getRivalName(event, firstIndex));
    rivals.push(self._getRivalName(event, secondIndex));

    return rivals;
};

ChallengeModel.prototype._getScore = function(event, activeSchoolId){
    const self = this,
        firstIndex = self._getFirstIndex(event, activeSchoolId),
        secondIndex = 1-firstIndex,
        firstResult = self._getResultByTeam(event, firstIndex),
        secondResult = self._getResultByTeam(event, secondIndex);

    return firstResult + " : " + secondResult;
};

module.exports = ChallengeModel;