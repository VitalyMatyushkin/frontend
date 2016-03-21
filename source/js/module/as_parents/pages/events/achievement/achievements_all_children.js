/**
 * Created by Anatoly on 17.03.2016.
 */

const   React               = require('react'),
        AchievementModel    = require('module/as_parents/pages/events/achievement/achievement_model'),


AchievementsAllChildren = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding();
    },
    renderAllAchievements:function(){
        var self = this,
            binding = self.getDefaultBinding();
        let result = <div className="eAchievement_row">{'no children'}</div>;

        if(binding.get('eventChild') && binding.get('eventChild').count()) {
            result = binding.get('eventChild').map(function (child, key) {
                child.events = (binding.get('models') && binding.get('models').count()) ? binding.get('models').filter(function (model) {
                    return model.get('childId') === child.get('childId');
                }) : 0;
                let model = new AchievementModel(child.get('childId'), child.events && child.events.toJS());
                model.childName = child.get('firstName') + ' ' + child.get('lastName');
                return (
                    <div key={key} className="eAchievement_row">
                        <div
                            className="eAchievement_common eAchievement_name">{model.childName}</div>
                        <div
                            className="eAchievement_common eAchievementGamesPlayed">{model.gamesPlayed}</div>
                        <div className="eAchievement_common eAchievementGamesWon">{model.gamesWon}</div>
                        <div className="eAchievement_common eAchievementGamesLost">{model.gamesLost}</div>
                        <div className="eAchievement_common eAchievementGoalsScored">{model.goalsScored}</div>
                    </div>
                )
            }).toArray();
        }

        return result;
    },
    render: function () {
        var self = this,
            binding = self.getDefaultBinding();

        return (
            <div className="eAllAchievements_container">
                <div className="eAchievement_header">
                    <div className="eAchievement_common eAchievement_name">Child Name</div>
                    <div className="eAchievement_common eAchievementGamesPlayed">Games Played</div>
                    <div className="eAchievement_common eAchievementGamesWon">Games Won</div>
                    <div className="eAchievement_common eAchievementGamesLost">Games Lost</div>
                    <div className="eAchievement_common eAchievementGoalsScored">Goals Scored</div>
                </div>
                {self.renderAllAchievements()}
            </div>
        )
    }
});

module.exports = AchievementsAllChildren;
