/**
 * Created by bridark on 25/04/15.
 */
var UserAchievements;
UserAchievements = React.createClass({
    mixins: [Morearty.Mixin],
    getClosedFixtures:function(data){
        var tempAr = [],
            goalScored;
        if(data){
           // console.log(data.resultsData);
           goalScored = data.pointsData.length; //console.log(goalScored);
            for(var i = 0; i<data.resultsData.length; i++){
                for(var x = 0; x < data.pointsData.length; x++){
                    if(data.resultsData[i].winner === data.pointsData[x].participantId){
                        tempAr.push(data.resultsData[i]);
                        break;
                    }
                }
            }
        }
        return <div className="eChallenge_in">
            <div className="eChallenge_rivalName">
                Wins {tempAr.length}
            </div>
            <div className="eChallenge_rivalName">
                Goals Scored {goalScored}
            </div>
        </div>
    },

    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            data = binding.toJS(),
            results = self.getClosedFixtures(data);
        return (
            <div className="bUserFullInfo">
                <div className="eUserFullInfo_block">
                    <div className="eUserFullInfo_name">Personal Achievements:</div>
                    <div className="bChallenges">{results}</div>
                </div>
            </div>
        )
    }
});
module.exports = UserAchievements;