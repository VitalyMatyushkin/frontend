/**
 * Created by bridark on 03/08/15.
 */
const   CalendarView    = require('module/ui/calendar/calendar'),
        React           = require('react'),
        Immutable 	    = require('immutable'),
        DateTimeMixin   = require('module/mixins/datetime'),
        Sport           = require('module/ui/icons/sport_icon'),
        Superuser       = require('module/helpers/superuser');

const HomeCalender = React.createClass({

    mixins:[Morearty.Mixin,DateTimeMixin],

    componentWillMount:function(){
        const   self            = this,
                rootBinding     = self.getMoreartyContext().getBinding(),
                activeSchoolId  = rootBinding.get('activeSchoolId');

        Superuser.runAsSuperUser(rootBinding, () => {
            return window.Server.eventsBySchoolId.get({schoolId:activeSchoolId}).then((events) => {
                rootBinding.set('events',Immutable.fromJS(events));
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
    getSportIcon:function(sport){
        const name = sport ? sport.name : '';

        return <Sport name={name} className="bIcon_mSport" ></Sport>;
    },
    getCalenderFixtureLists:function(){
        const   self        = this,
                binding     = self.getDefaultBinding(),
                fixtureList = binding.get('fixtures');
        if(fixtureList !== undefined){
            const fixtures = fixtureList.toJS();
            return fixtures.map(function(fixture){
                const   team1 = self.getTeams(fixture.participants[0]),
                        team2 = self.getTeams(fixture.participants[1]);
                return (
                    <div key={fixture.id} className="eSchoolFixtureListItem">
                        <span className="eSchoolCalenderFixtureItem">{self.getSportIcon(fixture.sport)}</span>
                        <span className="eSchoolCalenderFixtureItem">{self.getDateFromIso(fixture.startTime)}</span>
                        <span className="eSchoolCalenderFixtureItem">{team1+' vs '+team2}</span>
                        <span className="eSchoolCalenderFixtureItem">{self.getTimeFromIso(fixture.startTime)+ ' '}</span>
                    </div>
                );
            });
        }
    },
    render:function(){
        const   self            = this,
                binding         = self.getDefaultBinding(),
                upcomingLists   = self.getCalenderFixtureLists();
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