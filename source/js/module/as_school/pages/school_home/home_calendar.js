/**
 * Created by bridark on 03/08/15.
 */
const   CalendarView    = require('module/ui/calendar/calendar'),
        React           = require('react'),
        Immutable 	    = require('immutable'),
        DateTimeMixin   = require('module/mixins/datetime'),
        Superuser       = require('module/helpers/superuser');

const HomeCalender = React.createClass({
    mixins:[Morearty.Mixin,DateTimeMixin],
    componentWillMount:function(){
        var self = this,
            rootBinding = self.getMoreartyContext().getBinding();

        Superuser.runAsSuperUser(rootBinding, function(logout) {
            window.Server.eventsBySchoolId.get({schoolId:rootBinding.get('activeSchoolId')}).then(function(events){
                rootBinding.set('events',Immutable.fromJS(events));
                logout();
            });
        });
    },
    getTeams:function(participants){
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
                        <span className="eSchoolCalenderFixtureItem">{fixture.sport.name}</span>
                        <span className="eSchoolCalenderFixtureItem">{self.getDateFromIso(fixture.startTime)}</span>
                        <span className="eSchoolCalenderFixtureItem">{team1+' vs '+team2}</span>
                        <span className="eSchoolCalenderFixtureItem">{self.getTimeFromIso(fixture.startTime)+ ' '}</span>
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
                    <h1>Calendar</h1><hr/>
                </div>
                <div className="eSchoolCalendarWrapper">
                    <CalendarView binding={binding} />
                    <div className="eSchoolCalenderFixtureList">
                        <div className="eSchoolCalenderFixtureTitle">
                            <span className="eSchoolCalenderFixtureItem">Sport</span>
                            <span className="eSchoolCalenderFixtureItem">Date</span>
                            <span className="eSchoolCalenderFixtureItem">Game Type</span>
                            <span className="eSchoolCalenderFixtureItem">Time</span>
                        </div>
                        {upcomingLists}
                    </div>

                </div>
            </div>
        );
    }
});
module.exports = HomeCalender;