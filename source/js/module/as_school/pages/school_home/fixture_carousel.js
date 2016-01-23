/**
 * Created by bridark on 06/08/15.
 */
var FixtureCarousel,
    React = require('react');
FixtureCarousel = React.createClass({
    mixins:[Morearty.Mixin],
    getParticipantEmblem:function(participant){
        if(participant !== undefined){
            return(
                <div>
                    <img src={participant.school.pic}/>
                </div>
            );
        }
    },
    getParticipantName:function(participant){
        if(participant !== undefined){
            return (
                <div>
                    <span>{participant.house !== undefined ? participant.house.name:''}</span>
                </div>
            )
        }
    },
    getCommentsForFixture:function(fixture){
        if(fixture.result !== undefined){
            return (
                <div>
                    <div className="versusText">{'Vs'}</div>
                    <div className="carouselFixtureComment">{fixture.result.comment}</div>
                </div>
            )
        }
    },
    _sortFixtureData:function(data){
        var self = this;
        if(data !== undefined && data !== null){
            var sortedByStatus = data.filter(function(f){
                return f.status === 'closed';
            });
            return (
                <div>
                    <div className="blogAuthorPicCarousel">
                        <div className="fixtureCarouselSchoolPic">
                            {self.getParticipantEmblem(sortedByStatus[sortedByStatus.length-1].participants[0])}
                        </div>
                        <div className="fixtureCarouselParticipantName">
                            {self.getParticipantName(sortedByStatus[sortedByStatus.length-1].participants[0])}
                        </div>
                    </div>
                    <div className="fixtureCarouselSchoolComment">
                        {self.getCommentsForFixture(sortedByStatus[sortedByStatus.length-1])}
                    </div>
                    <div className="blogAuthorPicCarousel">
                        <div className="fixtureCarouselSchoolPic">
                            {self.getParticipantEmblem(sortedByStatus[sortedByStatus.length-1].participants[1])}
                        </div>
                        <div className="fixtureCarouselParticipantName">
                            {self.getParticipantName(sortedByStatus[sortedByStatus.length-1].participants[1])}
                        </div>
                    </div>
                </div>
            );
        }
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            sortedFixture = self._sortFixtureData(binding.toJS());
        return (
            <div className="testChildren">
                {sortedFixture}
            </div>
        );
    }
});
module.exports = FixtureCarousel;