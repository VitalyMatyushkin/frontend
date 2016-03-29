/**
 * Created by Anatoly on 28.03.2016.
 */

const DateHelper = require('module/helpers/date_helper'),

ChallengeModel = function(event, activeSchoolId){
    const self = this;

    self.activeSchoolId = activeSchoolId;
    self.id = event.id;
    self.name = event.name;
    self.sport = event.sport ? event.sport.name : '';
    self.date = DateHelper.getDate(event.startTime);
    self.time = DateHelper.getTime(event.startTime);
    self.rivals = self._getRivals(event, activeSchoolId);
};

ChallengeModel.prototype._getRivalName = function(event, order) {
    const self = this,
        type = event.type,
        played = !!event.resultId,
        participant = order < event.participants.length ? event.participants[order] : null,
        eventResult = played ? event.result.summary.byTeams : null;

    let	rivalName = null;

    switch(type) {
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
    else if (played && rivalName && eventResult) {
        let goal = eventResult[participant.id] ? eventResult[participant.id] : 0;
        rivalName += '[' + goal + ']';
    }

    return rivalName;
};

ChallengeModel.prototype._getRivals = function(event, activeSchoolId){
    const self = this,
        activeIndex = event.participants.findIndex(participant => participant.schoolId === activeSchoolId),
        firstIndex = event.type === 'inter-schools' && event.participants.length > 1 && activeIndex >= 0 ? activeIndex : 0,
        secondIndex = 1-firstIndex,
        rivals = [];

    rivals.push(self._getRivalName(event, firstIndex));
    rivals.push(self._getRivalName(event, secondIndex));

    return rivals;
};

module.exports = ChallengeModel;