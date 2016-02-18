/**
 * Created by bridark on 25/04/15.
 */

const   React       = require('react'),
        Immutable   = require('immutable');

const UserFixtures = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes: {
        title: React.PropTypes.string
    },
    componentDidMount:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            fixtureBinding = self.getMoreartyContext().getBinding(),
            studentId = fixtureBinding.get('routing.parameters.id');
    },
    _getFixtureData:function(fixtureData){
        var tempAr = [];
        if(fixtureData){
            for(var i=0; i<fixtureData.length;i++){
                tempAr.push(
                    <div className="eUserFullInfo_text bLinkLike">
                    <div className="eUserFullInfo_date">{fixtureData[i].startRegistrationTime}</div>
                    {fixtureData[i].name} <div>Type: {fixtureData[i].gameType}</div></div>
                );
            }
            return tempAr;
        }
        return null;
    },
    sameDay: function (d1, d2) {
        d1 = d1 instanceof Date ? d1 : new Date(d1);
        d2 = d2 instanceof Date ? d2 : new Date(d2);

        return d1.getUTCFullYear() === d2.getUTCFullYear() &&
            d1.getUTCMonth() === d2.getUTCMonth() &&
            d1.getUTCDate() === d2.getUTCDate();
    },
    addZeroToFirst: function (num) {
        return String(num).length === 1 ? '0' + num : num;
    },
    onClickChallenge: function (eventId) {
        document.location.hash = 'event/' + eventId;
    },
    getCountPoint: function (points, participantId) {
        var self = this;

        return points.filter(function (point) {
            return point.get('participantId') === participantId;
        }).count();
    },
    getEvents: function (date,theData) {
        var self = this,
            binding = this.getDefaultBinding(),
            eventsByDate;
        if(theData && theData.schoolEvent) {
            eventsByDate = theData.schoolEvent.filter(function (event) {
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
                    secondName = event.participants[1]!== undefined ?event.participants[1].school.name :'';
                    firstPic = event.participants[0].school.pic;
                    secondPic = event.participants[1]!==undefined?event.participants[1].school.pic:'';
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
                    <div className="eChallenge_hours">{hours + ':' + minutes}</div>
                    <div className="eChallenge_in">
                        <div className="eChallenge_rivalName">
                            {firstPic ? <span className="eChallenge_rivalPic"><img src={firstPic}/></span> : ''}
                            {firstName}
                        </div>
                        <div
                            className={'eChallenge_results' + (event.resultId ? ' mDone' : '') }>{event.resultId ? [firstPoint, secondPoint].join(':') : '- : -'}</div>
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
        if(dataFrom && dataFrom.schoolEvent){
            dates = dataFrom.schoolEvent.reduce(function(memo,val){
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
                    daysOfWeek = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
                    monthNames = [ "January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December" ],
                    dayOfWeek = date.getDay();
                return <div key={dateTimeIndex} className="bChallengeDate">
                    <div className="eAchievements_wrap">
                        <div className="eChallengeDate_date">
                            {daysOfWeek[dayOfWeek] + ' ' +
                            date.getDate() + ' ' +
                            monthNames[date.getMonth()] + ' ' +
                            date.getFullYear()}
                        </div>
                        <div className="eChallengeDate_list">{self.getEvents(datetime, dataFrom)}</div>
                    </div>
                </div>;
            }).toArray() : null;
        }
    },
    render: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            data = binding.toJS(),
            challenges = self.getDates(data);

        return <div>
            <div className="bChallenges">{challenges}</div>
        </div>;
    }
});
module.exports = UserFixtures;