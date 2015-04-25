/**
 * Created by bridark on 25/04/15.
 */
var UserAchievements;
UserAchievements = React.createClass({
    mixins: [Morearty.Mixin],
    render:function(){
        var self = this,
            binding = self.getDefaultBinding();
        return (
            <div className="bUserFullInfo">
                <div className="eUserFullInfo_block">
                    <div className="eUserFullInfo_name">Personal Achievements:</div>
                    <div className="eUserFullInfo_text bLinkLike">Football match with Cannys House 5:2</div>
                    <div className="eUserFullInfo_text bLinkLike">Football match with Ladouys Winders House 10:9</div>
                </div>
            </div>
        )
    }
});
module.exports = UserAchievements;