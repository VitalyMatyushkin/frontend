/**
 * Created by bridark on 25/04/15.
 */
const   React           = require('react'),
        EventHelper		= require('module/helpers/eventHelper'),
        Immutable        = require('immutable');

const UserAchievements = React.createClass({
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
                //console.log(data1[i]);
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
    getEvents: function (date, theData) {
        var self = this,
            binding = this.getDefaultBinding(),
            eventsByDate;

        if (theData && theData.gamesScoredIn) {
            eventsByDate = theData.gamesScoredIn.filter(function (event) {
                return self.sameDay(
                    new Date(event.startTime),
                    new Date(date));
            });
            return eventsByDate.map(function (event, index) {
                var eventDateTime = new Date(event.startTime),
                    hours = self.addZeroToFirst(eventDateTime.getHours()),
                    minutes = self.addZeroToFirst(eventDateTime.getMinutes()),
                    type = event.eventType,
                    firstName,
                    secondName,
                    firstPic,
                    secondPic,
                    firstPoint,
                    comment,
                    secondPoint;

                if (event.result && event.result.comment){
                    comment = event.result.comment;
                } else {
                    comment = "There are no comments on this fixture";
                }
                if (type === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']) {
                    firstName = event.participants[0].school.name;
                    secondName = !event.resultId ? event.invites[0].guest.name : event.participants[1].school.name;
                    firstPic = event.participants[0].school.pic;
                    secondPic = event.participants[1].school.pic || event.invites[1].guest.pic;
                } else if (type === EventHelper.clientEventTypeToServerClientTypeMapping['houses']) {
                    firstName = event.participants[0].house.name;
                    secondName = event.participants[1].house.name;
                    firstPic = event.participants[0].school.pic;
                    secondPic = event.participants[1].school.pic;
                } else if (type === EventHelper.clientEventTypeToServerClientTypeMapping['internal']) {
                    firstName = event.participants[0].name;
                    secondName = event.participants[1].name;
                    firstPic = event.participants[0].school.pic;
                    secondPic = event.participants[1].school.pic;
                }
                if (event.status === EventHelper.EVENT_STATUS.FINISHED) {
                    const eventSummary = EventHelper.getTeamsSummaryByEventResult(event.result);

                    firstPoint = eventSummary[event.participants[0].id] || 0;
                    secondPoint = eventSummary[event.participants[1].id] || 0;
                }
                //console.log(index+"  index");
                return <div key={index} className="bAchievement"
                            onClick={self.onClickChallenge.bind(null, event.id)}
                            id={'challenge-' + event.id}
                    >
                    <div className="eAchievement_in">
                        <div className="eAchievement_rivalName">
                            {firstPic ? <span className="eChallenge_rivalPic"><img src={firstPic}/></span> : ''}
                            <span className="eAchievement_rival">{firstName}</span>
                        </div>
                        <div className="eAchievement_rivalInfo">
                            <div
                                className={'eAchievement_results' + (event.status === EventHelper.EVENT_STATUS.FINISHED ? ' mDone' : '') }
                            >
                                {event.status === EventHelper.EVENT_STATUS.FINISHED ? [firstPoint, secondPoint].join(':') : '? : ?'}
                            </div>
                            <div className="eAchievement_info">{EventHelper.serverEventTypeToClientEventTypeMapping[event.eventType]}</div>
                        </div>
                        <div className="eAchievement_rivalName">
                            {secondPic ? <span className="eChallenge_rivalPic"><img src={secondPic}/></span> : ''}
                            <span className="eAchievement_rival">{secondName}</span>
                        </div>
                    </div>
                    <div className="eAchievement_com_container">
                        <div className="eChallenge_comments">
                            {comment}
                        </div>
                    </div>
                </div>;
            });
        }
    },
    getDates: function (dataFrom) {
        var self = this,
            binding = self.getDefaultBinding(),
            dates;
        if(dataFrom && dataFrom.gamesScoredIn){
            dates = dataFrom.gamesScoredIn.reduce(function(memo,val){
                var date = Date.parse(val.startTime),N
                    any = memo.some(function(d){
                        return self.sameDay(date,d);
                    });
                if(!any){
                    memo = memo.push(date);
                }
                return memo;
            }, Immutable.List());

            return dates.count()!==0 ? dates.sort().map(function(datetime, dateTimeIndex){
                var date = new Date(datetime),
                    monthNames = [ "January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December" ];
                return <div key={dateTimeIndex} className="bAchievementsDate">
                    <h4>Scored in this fixture</h4>
                    <div className="eAchievementsDate_date">
                        {date.getDate() + ' ' +
                        monthNames[date.getMonth()] + ' ' +
                        date.getFullYear()}
                    </div>
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