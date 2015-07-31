/**
 * Created by bridark on 31/07/15.
 */
var HomeFixtures,
    DateTimeMixin = require('module/mixins/datetime'),
    SVG = require('module/ui/svg');
HomeFixtures = React.createClass({
    mixins:[Morearty.Mixin,DateTimeMixin],
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('activeSchoolId');
        window.Server.eventsBySchoolId.get({schoolId:activeSchoolId}).then(function(events){
            binding.set('fixtures',Immutable.fromJS(events));
            console.log(events);
        });
    },
    getFixtureDate:function(startTime, type){
        var self = this;
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
        if(sport !== undefined){
            var icon;
            switch (sport.name){
                case 'football':
                    icon = <SVG classes="bIcon_fixture_mod" icon="icon_soccer"></SVG>;
                    break;
                case 'cricket':
                    icon = <SVG classes="bIcon_fixture_mod" icon="icon_baseball"></SVG>;
                    break;
                case 'rugby':
                    icon = <SVG classes="bIcon_fixture_mod" icon="icon_football"></SVG>;
                    break;
                default:
                    icon = <SVG classes="bIcon_fixture_mod" icon="icon_baseball"></SVG>;
                    break;
            }
            return icon;
        }
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
            var firstPoint = event.result.summary.byTeams[event.participants[0].id] !== undefined?event.result.summary.byTeams[event.participants[0].id]: 0,
                secondPoint = event.result.summary.byTeams[event.participants[0].id] !== undefined?event.result.summary.byTeams[event.participants[0].id]: 0;
            return(
                <div>
                    <div className="bFix_scoreText">{'Score'}</div>
                    <div className="bFix_scoreResult">{firstPoint+' : '+secondPoint}</div>
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
                    <div className="bFixtureContainer">
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
            binding = self.getDefaultBinding(),
            fixtures = self.renderFixtureLists();
        return (
            <div className="eSchoolFixtures">
                <div className="eSchoolFixtureTab">
                    <i>Fixtures</i>
                    <span></span>
                </div>
                {fixtures}
            </div>
        );
    }
});
module.exports = HomeFixtures;