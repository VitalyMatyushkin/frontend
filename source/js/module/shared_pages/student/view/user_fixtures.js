/**
 * Created by bridark on 25/04/15.
 */

const   React           = require('react'),
        EventHelper     = require('module/helpers/eventHelper'),
   	 	{GameType} 		= require('module/ui/challenges/event-game-type-with-score'),
		Sport 			= require('module/ui/icons/sport_icon'),
	    SessionHelper	= require('module/helpers/session_helper'),
        Morearty        = require('morearty'),
        Immutable       = require('immutable');

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
		//we must pass schoolId in hash because event-page component use schoolId from routing.parameters
		const activeSchoolId = this.getDefaultBinding().toJS().schoolId;
		document.location.hash = 'event/' + eventId  + '?schoolId=' + activeSchoolId;
    },
    getCountPoint: function (points, participantId) {
        var self = this;

        return points.filter(function (point) {
            return point.get('participantId') === participantId;
        }).count();
    },
    getEvents: function (date,theData) {
		const self = this;

        let eventsByDate;
        if(theData && theData.schoolEvent) {
            eventsByDate = theData.schoolEvent.filter(function (event) {
                return self.sameDay(
                    new Date(event.startTime),
                    new Date(date));
            });
            return eventsByDate.map(function (event, index) {
				const sportName = event.sport && event.sport.name;

				let comment;

                if(event.result && event.result.comment){
                    comment = event.result.comment;
                }else{
                    comment = "There are no comments on this fixture";
                }
                return <div key={index} className="bChallenge"
                            onClick={self.onClickChallenge.bind(null, event.id)}
                            id={'challenge-' + event.id}
                    >
					<div className="eChallenge_type">
						<Sport name={sportName} />
						<span>{sportName}</span>
					</div>
					<GameType
						event={event}
						activeSchoolId={self.getDefaultBinding().toJS('schoolId')}
					/>
					<div className="eChallenge_type">{event.name}</div>
					<div className="eChallenge_type">
                        {EventHelper.serverEventTypeToClientEventTypeMapping[event.eventType]}
                    </div>
					{/*<div className="eChallenge_com_container">
                        <div className="eChallenge_comments">
                            {comment}
                        </div>
                    </div>*/}
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
                    monthNames = [ "January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December" ],
                    dayOfWeek = date.getDay();
                return <div key={dateTimeIndex} className="bChallengeDate">
                    <div className="eAchievements_wrap">
                        <div className="eChallengeDate_date">
                            {date.getDate() + ' ' +
                            monthNames[date.getMonth()] + ',' +
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