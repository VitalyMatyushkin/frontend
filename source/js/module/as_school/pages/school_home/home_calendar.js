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
        if(sport !== undefined){
            var icon;
            switch (sport.name){
                case 'football':
                    icon = <img classes="bIcon_fixture_mod" src="/images/ball.png"></img>;
                    break;
                case 'cricket':
                    icon = <img classes="bIcon_fixture_mod" src="/images/cricket.png"></img>;
                    break;
                case 'hockey':
                    icon = <img classes="bIcon_fixture_mod" src="/images/hockey.png"></img>;
                    break;
                case 'rugby':
                    icon = <img classes="bIcon_fixture_mod" src="/images/rugby_ball.png"></img>;
                    break;
                case 'netball':
                    icon = <img classes="bIcon_fixture_mod" src="/images/netball.png"></img>;
                    break;
                default:
                    icon = <img classes="bIcon_fixture_mod" src="/images/rounders.png"></img>;
                    break;
            }
            return icon;
        }
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