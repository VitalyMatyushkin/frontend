/**
 * Created by bridark on 25/04/15.
 */
const   React           = require('react'),
		EventRivals 	= require('./event-rivals'),
        Morearty        = require('morearty'),
        Immutable       = require('immutable');

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
		const   self 		= this,
			rootBinding = self.getMoreartyContext().getBinding();

		const 	role 		= rootBinding.get('userData.authorizationInfo.role'),
				isParent 	= role === "PARENT";
		const activeSchoolId = isParent ? null : rootBinding.get('userRules.activeSchoolId');

		let eventsByDate;

        if (theData && theData.gamesScoredIn) {
            eventsByDate = theData.gamesScoredIn.filter(function (event) {
                return self.sameDay(
                    new Date(event.startTime),
                    new Date(date));
            });
            return eventsByDate.map(function (event, index) {
                let comment;

                if (event.result && event.result.comment){
                    comment = event.result.comment;
                } else {
                    comment = "There are no comments on this fixture";
                }

                return (
                    <div key={index} className="bAchievement"
                            onClick={self.onClickChallenge.bind(null, event.id)}
                            id={'challenge-' + event.id}
                    >
						<h4>{event.name}</h4>
						<h6>{`Scored: ${event.studentScore}`}</h6>
						<EventRivals event={event} activeSchoolId={activeSchoolId} />
						{/*<div className="eAchievement_com_container">
                            <div className="eChallenge_comments">
                                {comment}
                            </div>
                        </div>*/}
						<br/>
                    </div>
                );
            });
        }
    },
    getDates: function (dataFrom) {
        var self = this,
            binding = self.getDefaultBinding(),
            dates;
        if(dataFrom && dataFrom.gamesScoredIn){
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

            return dates.count()!==0 ? dates.sort().map(function(datetime, dateTimeIndex){
                var date = new Date(datetime),
                    monthNames = [ "January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December" ];
                return <div key={dateTimeIndex} className="bAchievementsDate">
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