/**
 * Created by Anatoly on 28.03.2016.
 */
const   DateHelper  = require('module/helpers/date_helper'),
        EventHelper = require('module/helpers/eventHelper');

const ChallengeModel = function(event, activeSchoolId){
    const self = this;

    self.activeSchoolId = activeSchoolId;
    self.id = event.id;
    self.name = event.name;
    self.played = !!event.result;
    self.sport = event.sport ? event.sport.name : '';
    self.date = DateHelper.getDate(event.startTime);
    self.time = DateHelper.getTime(event.startTime);
    self.rivals = self._getRivals(event, activeSchoolId);
    self.score = self._getScore(event, activeSchoolId);
};

ChallengeModel.prototype._getResultByTeam = function(event, order) {
    const self = this,
        participant = order < event.participants.length ? event.participants[order] : null;

    let goal = event.status === 'FINISHED' ? 0 : '-';

    if (self.played) {
        const eventSummary = EventHelper.getTeamsSummaryByEventResult(event.result);

        goal = eventSummary[participant.id] ? eventSummary[participant.id] : 0;
    }

    return goal;
};

ChallengeModel.prototype._getRivalName = function(event, order) {
    const self = this,
        eventType = event.eventType,
        played = self.played,
        participant = order < event.participants.length ? event.participants[order] : null;

    let	rivalName = null;

    switch(EventHelper.serverEventTypeToClientEventTypeMapping[eventType]) {
        case 'internal':
            rivalName = participant ? participant.name : null;
            break;
        case 'houses':
            rivalName = participant && participant.house ? participant.house.name : null;
            break;
        case 'inter-schools':
            if(participant && self.activeSchoolId == participant.schoolId && participant.name) {
                rivalName = participant.name;
            } else {
                rivalName = participant && participant.school ? participant.school.name : null;
            }
            break;
    }
    if (!rivalName) {
        rivalName = 'n/a';
    }
    else if (played && rivalName) {
        let goal = self._getResultByTeam(event, order);
        rivalName += '[' + goal + ']';
    }

    return rivalName;
};

ChallengeModel.prototype._getFirstIndex = function(event, activeSchoolId){
    const activeIndex = event.participants.findIndex(participant => participant.schoolId === activeSchoolId);

    return event.type === 'inter-schools' && event.participants.length > 1 && activeIndex >= 0 ? activeIndex : 0;
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