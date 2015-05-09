/**
 * Created by bridark on 25/04/15.
 */
var UserAchievements;
UserAchievements = React.createClass({
    mixins: [Morearty.Mixin],
    addZeroToFirst: function (num) {
        return String(num).length === 1 ? '0' + num : num;
    },
    onClickChallenge: function (eventId) {
        document.location.hash = 'event/' + eventId;
    },
    sameDay: function (d1, d2) {
        d1 = d1 instanceof Date ? d1 : new Date(d1);
        d2 = d2 instanceof Date ? d2 : new Date(d2);

        return d1.getUTCFullYear() === d2.getUTCFullYear() &&
            d1.getUTCMonth() === d2.getUTCMonth() &&
            d1.getUTCDate() === d2.getUTCDate();
    },
    compareData:function(data1,data2){
        var tempAr = [];
        for(var i=0; i<data1.length;i++){
            for(var x= 0; x < data2.length; x++){
                console.log(data1[i]);
                if(data1[i].resultId){
                    if(data1[i].resultId === data2[x].id){
                        tempAr.push(data1[i]);
                        data1.splice(i,1);
                    }
                }
            }
        }
        return tempAr;
    },
    getEvents: function (date,theData) {
        var self = this,
            binding = this.getDefaultBinding(),
            eventsByDate = theData.gamesScoredIn.filter(function (event) {
                return self.sameDay(
                    new Date(event.startTime),
                    new Date(date));
            });
        return eventsByDate.map(function(event,index){
            var eventDateTime = new Date(event.startTime),
                hours = self.addZeroToFirst(eventDateTime.getHours()),
                minutes = self.addZeroToFirst(eventDateTime.getMinutes()),
                type = event.type,
                gameType = event.gameType,
                gameName = event.name,
                gameDescription = event.description;

            return(<div className = "bChallenge"  onClick={self.onClickChallenge.bind(null, event.id)}
                        id={'challenge-' + event.id}>
                <div className="eChallenge_in">
                    <div className="eChallenge_rivalName">
                        {gameName}
                    </div>
                    <div className="eChallenge_rivalInfo">
                        <div className="eChallenge_hours">{gameType}</div>
                        <div className="eChallenge_results">{}</div>
                        <div className="eChallenge_info">{type}</div>
                    </div>
                    <div className="eChallenge_rivalName">
                        {gameDescription}
                    </div>
                </div>
            </div>);
        });
    },
    getDates: function (dataFrom) {
        var self = this,
            binding = self.getDefaultBinding(),
            dates;
        if(dataFrom){
            dates = dataFrom.gamesScoredIn.reduce(function(memo,val){
                var date = Date.parse(val.startTime),
                    any = memo.some(function(d){
                        return self.sameDay(date,d);
                    });
                if(!any){
                    memo = memo.push(date);
                }
                return memo;
            }, Immutable.List());

            return dates.count()!==0 ? dates.sort().map(function(datetime){
                var date = new Date(datetime),
                    daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
                    monthNames = [ "January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December" ],
                    dayOfWeek = date.getDay();
                return <div className="bChallengeDate">
                    <div className="eChallengeDate_date">
                        {daysOfWeek[dayOfWeek] + ' ' +
                        date.getDate() + ' ' +
                        monthNames[date.getMonth()] + ' ' +
                        date.getFullYear()}
                    </div>
                    <h4>Scored in this fixture</h4>
                    <div className="eChallengeDate_list">{self.getEvents(datetime,dataFrom)}</div>
                </div>;
            }).toArray() : (<div>Student hasn't achieved a goal yet!</div>);
        }
    },
    checkForWinner:function(data1,data2){
        var tempAr = [];
        for(var i=0; i<data1.length;i++){
            for(var x= 0; x < data2.length; x++){
                if(data1[i].participants[0].id === data2[x].winner || data1[i].participants[1].id === data2[x].winner ){
                    tempAr.push(data1[i]);
                    data1.splice(i,1);
                }
            }
        }
        return tempAr;
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            data = binding.toJS(),
            teamStats = self.getDates(data);
        return (<div>{teamStats}</div>)
    }
});
module.exports = UserAchievements;