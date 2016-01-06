/**
 * Created by bridark on 03/08/15.
 */
var HomeCalender,
    CalendarView = require('module/ui/calendar/calendar'),
    React = require('react'),
    DateTimeMixin = require('module/mixins/datetime');
HomeCalender = React.createClass({
    mixins:[Morearty.Mixin,DateTimeMixin],
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding();
        window.Server.eventsBySchoolId.get({schoolId:rootBinding.get('activeSchoolId')}).then(function(events){
            rootBinding.set('events',Immutable.fromJS(events));
        });
    },
    getTeams:function(participants){
        var self = this;
        if(participants !== undefined){
            return participants.name;
        }else{
            return 'n/a';
        }
    },
    getSport:function(){

    },
    getCalenderFixtureLists:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            fixtureList = binding.get('fixtures');
        if(fixtureList !== undefined){
            var fixtures = fixtureList.toJS();
            return fixtures.map(function(fixture){
                var team1 = self.getTeams(fixture.participants[0]),
                    team2 = self.getTeams(fixture.participants[1]);
                return (
                    <div key={fixture.id} className="eSchoolFixtureListItem">
                        <h5>{self.getDateFromIso(fixture.startTime)+ ':'}</h5>
                        <span>{self.getTimeFromIso(fixture.startTime)+ ' '}</span>
                        <span>{fixture.sport.name+ ' '+fixture.type+'; '+team1+'; '+team2}</span>
                    </div>
                );
            });
        }
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            upcomingLists = self.getCalenderFixtureLists();
        return (
            <div className="eSchoolCalenderContainer">
                <div className="eSchoolFixtureTab eCalendar_tab">
                    <i>Calendar</i>
                    <span></span>
                </div>
                <div className="eSchoolCalendarWrapper">
                    <CalendarView binding={binding} />
                    <div className="eSchoolCalenderFixtureList">
                        <h4>Fixtures:</h4>
                        {upcomingLists}
                    </div>
                </div>
            </div>
        );
    }
});
module.exports = HomeCalender;