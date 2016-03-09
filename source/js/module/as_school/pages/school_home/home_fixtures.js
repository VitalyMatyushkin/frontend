/**
 * Created by bridark on 31/07/15.
 */
const   DateTimeMixin   = require('module/mixins/datetime'),
        React           = require('react'),
        Immutable 	    = require('immutable'),
        Sport           = require('module/ui/icons/sport_icon'),
        Superuser       = require('module/helpers/superuser');

const HomeFixtures = React.createClass({
    mixins:[Morearty.Mixin,DateTimeMixin],
    componentWillMount:function(){
        const   self            = this,
                binding         = self.getDefaultBinding(),
                rootBinding     = self.getMoreartyContext().getBinding(),
                activeSchoolId  = rootBinding.get('activeSchoolId');

        self._setFixturesByDate(binding.toJS('currentDate'));

        //Get all evens for calendar
        //Superuser.runAsSuperUser(rootBinding, () => {
        //    return window.Server.fixturesBySchoolId.get(
        //        {
        //            schoolId: activeSchoolId,
        //            filter: {
        //                order: 'startTime ASC'
        //            }
        //        }).then((events) => {
        //            binding.set('models',Immutable.fromJS(events));
        //        }
        //    );
        //});

        binding.sub('selectDay').addListener((descriptor) => {
            self._setFixturesByDate(descriptor.getCurrentValue().date);
        });
    },
    _setFixturesByDate:function(date) {
        const self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId  = rootBinding.get('activeSchoolId');

        Superuser.runAsSuperUser(rootBinding, () => {
            return window.Server.fixturesBySchoolId.get({schoolId:activeSchoolId, filter:{order:'startTime ASC'}}).then((events) => {
                const filteredEvents = events.filter((event) => {
                    const eventDate = new Date(event.startTime).toLocaleDateString(),
                        currentDate = date.toLocaleDateString();

                    return currentDate == eventDate;
                });

                binding
                    .atomically()
                    .set('fixtures',Immutable.fromJS(filteredEvents))
                    .set('fixturesSync',Immutable.fromJS(true))
                    .commit();
            });
        });
    },
    getFixtureDate:function(startTime, type){
        const self = this;
        if(startTime !== undefined){
            return(
                <div>
                    <div className="bFix_date">{self.getDateFromIso(startTime)}</div>
                    <div className="bFix_time">{self.getTimeFromIso(startTime)}</div>
                    <div className="bFix_type">{type}</div>
                </div>
            )
        }
    },
    getSportIcon:function(sport){
        const name = sport ? sport.name : '';

        return <Sport name={name} className="bIcon_mSport" ></Sport>;
    },
    getParticipantEmblem:function(participant){
        if(participant !== undefined){
            return(
                <div>
                    <img src={participant.school.pic}/>
                    <span>{participant.house !== undefined ? participant.house.name:''}</span>
                </div>
            );
        }
    },
    getFixtureResults:function(event){
        if(event.result !== undefined){
            const teamSummary = event.result.summary.byTeams,
                  firstPoint =  teamSummary[event.participants[0].id] !== undefined ? teamSummary[event.participants[0].id] : 0,
                  secondPoint = teamSummary[event.participants[1].id] !== undefined ? teamSummary[event.participants[1].id] : 0;

            return(
                <div>
                    <div className="bFix_scoreText">{'Score'}</div>
                    <div className="bFix_scoreResult">{`${firstPoint} : ${secondPoint}`}</div>
                </div>
            );
        }else{
            return(
                <div>
                    <div className="bFix_scoreText">{'Score'}</div>
                    <div className="bFix_scoreResult">{'? : ?'}</div>
                </div>
            );
        }
    },
    renderFixtureLists:function(){
        const self = this,
            binding = self.getDefaultBinding(),
            events = binding.toJS('fixtures');

        let result;

        if(binding.toJS('fixturesSync')) {
            if(events !== undefined && events.length != 0){
                result = events.map(function(event){
                    return (
                        <div key={event.id} className="bFixtureContainer">
                            <div className="bFixtureIcon bFixture_item">{self.getSportIcon(event.sport)}</div>
                            <div className="bFixtureDate bFixture_item">{self.getFixtureDate(event.startTime,event.type)}</div>
                            <div className="bFixtureOpponent bFixture_item no-margin">{self.getParticipantEmblem(event.participants[0])}</div>
                            <div className="bFixtureResult bFixture_item no-margin">{self.getFixtureResults(event)}</div>
                            <div className="bFixtureOpponent bFixture_item no-margin">{self.getParticipantEmblem(event.participants[1])}</div>
                        </div>
                    );
                });
            } else {
                result = (
                    <div className="bFixtureMessage">
                        {"There aren't fixtures for current date"}
                    </div>
                );
            }
        } else {
            result = (
                <div className="bFixtureMessage">
                    {"Loading..."}
                </div>
            );
        }

        return result;
    },
    render:function(){
        var self = this,
            fixtures = self.renderFixtureLists();
        return (
            <div className="eSchoolFixtures">
                <div className="eSchoolFixtureTab">
                    <h1>Fixtures</h1><hr/>
                </div>
                {fixtures}
            </div>
        );
    }
});
module.exports = HomeFixtures;