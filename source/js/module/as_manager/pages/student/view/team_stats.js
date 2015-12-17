/**
 * Created by bridark on 03/05/15.
 */
var TeamStats;
TeamStats = React.createClass({
    mixins: [Morearty.Mixin],
    componentDidMount:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding();
    },
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
    getEvents: function (date,theData) {
        var self = this,
            binding = this.getDefaultBinding(),
            eventsByDate;
        if (theData && theData.gamesWon) {
            eventsByDate = theData.gamesWon.filter(function (event) {
                return self.sameDay(
                    new Date(event.startTime),
                    new Date(date));
            });
            return eventsByDate.map(function (event, index) {
                var eventDateTime = new Date(event.startTime),
                    hours = self.addZeroToFirst(eventDateTime.getHours()),
                    minutes = self.addZeroToFirst(eventDateTime.getMinutes()),
                    type = event.type,
                    firstName,
                    secondName,
                    firstPic,
                    secondPic,
                    firstPoint,
                    comment,
                    secondPoint;
                if(event.result && event.result.comment){
                    comment = event.result.comment;
                }else{
                    comment = "There are no comments on this fixture";
                }

                if (type === 'inter-schools') {
                    firstName = event.participants[0].school.name;
                    secondName = !event.resultId ? event.invites[0].guest.name : event.participants[1].school.name;
                    firstPic = event.participants[0].school.pic;
                    secondPic = event.participants[1].school.pic || event.invites[1].guest.pic;
                } else if (type === 'houses') {
                    firstName = event.participants[0].house.name;
                    secondName = event.participants[1].house.name;
                    firstPic = event.participants[0].school.pic;
                    secondPic = event.participants[1].school.pic;
                } else if (type === 'internal') {
                    firstName = event.participants[0].name;
                    secondName = event.participants[1].name;
                    firstPic = event.participants[0].school.pic;
                    secondPic = event.participants[1].school.pic;
                }
                if (event.resultId && event.result.summary) {
                    firstPoint = event.result.summary.byTeams[event.participants[0].id] || 0;
                    secondPoint = event.result.summary.byTeams[event.participants[1].id] || 0;
                }
                return <div key={index} className="bChallenge"
                            onClick={self.onClickChallenge.bind(null, event.id)}
                            id={'challenge-' + event.id}
                    >
                    <div className="eChallenge_in">
                        <div className="eChallenge_rivalName">
                            {firstPic ? <span className="eChallenge_rivalPic"><img src={firstPic}/></span> : ''}
                            {firstName}
                        </div>
                        <div className="eChallenge_rivalInfo">
                            <div className="eChallenge_hours">{hours + ':' + minutes}</div>
                            <div
                                className={'eChallenge_results' + (event.resultId ? ' mDone' : '') }>{event.resultId ? [firstPoint, secondPoint].join(':') : '? : ?'}</div>
                            <div className="eChallenge_info">{event.type}</div>
                        </div>
                        <div className="eChallenge_rivalName">
                            {secondPic ? <span className="eChallenge_rivalPic"><img src={secondPic}/></span> : ''}
                            {secondName}
                        </div>
                    </div>
                    <div className="eChallenge_com_container">
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
        if(dataFrom && dataFrom.gamesWon){
            dates = dataFrom.gamesWon.reduce(function(memo,val){
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
                    <div className="eChallengeDate_list">{self.getEvents(datetime,dataFrom)}</div>
                </div>;
            }).toArray() : (<div>Looks like the team is having a bad run</div>);
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
module.exports = TeamStats;