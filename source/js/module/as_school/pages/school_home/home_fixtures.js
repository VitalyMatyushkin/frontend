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

        Superuser.runAsSuperUser(rootBinding, () => {
            return window.Server.fixturesBySchoolId.get({schoolId:activeSchoolId, filter:{order:'startTime ASC'}}).then((events) => {
                binding.set('fixtures',Immutable.fromJS(events));
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
        var self = this,
            binding = self.getDefaultBinding(),
            events = binding.toJS('fixtures');
        if(events !== undefined){
            return events.map(function(event){
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
        }
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