/**
 * Created by Anatoly on 17.03.2016.
 */

const EventHelper = require('module/helpers/eventHelper');

const AchievementModel = function(studentId, events){
    const self = this;
    self.studentId = studentId;
    self.gamesPlayed = 0;
    self.gamesWon = 0;
    self.gamesLost = 0;
    self.goalsScored = 0;

    self._calculate(events);
};
AchievementModel.prototype._calculate = function(events){
    const self = this;

    if(events && events.length){
        events = events.filter(e => e.status == 'FINISHED');
        self.gamesPlayed = events.length;
        events.forEach(event => {
            let winnerId = EventHelper.getWinnerId(event.result),
                winner = event.participants.find(team => team.id === winnerId);

            // In the event of a dead heat, winner is undefined
            if(winner) {
                if(winner.players.find(p => p.userId === self.studentId)) {
                    self.gamesWon++;
                } else {
                    self.gamesLost++;
                }
            }

            event.result && event.result.points && event.result.points[self.studentId] && (self.goalsScored += event.result.points[self.studentId].score);
        })
    }
};

module.exports = AchievementModel;