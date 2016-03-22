/**
 * Created by Anatoly on 17.03.2016.
 */

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
        events = events.filter(e => e.status == 'closed' && e.result);
        self.gamesPlayed = events.length;
        events.forEach(event => {
            let winnerId = event.result.winner,
                winner = event.participants.find(team => team.id === winnerId);

            if(winner.players.find(p => p.id === self.studentId))
                self.gamesWon++;
            else
                self.gamesLost++;

            event.result.points.filter(p => p.studentId === self.studentId).forEach(point => {
                self.goalsScored += point.score;
            })
        })
    }
};

module.exports = AchievementModel;