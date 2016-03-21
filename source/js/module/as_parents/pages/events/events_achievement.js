/**
 * Created by bright boahen on 02/06/15.
 */
const   AchievementsAllChildren     = require('module/as_parents/pages/events/achievement/achievements_all_children'),
        AchievementOneChild         = require('module/as_parents/pages/events/achievement/achievement_one_child'),
        React                       = require('react'),
        If                          = require('module/ui/if/if'),

ParentChildAchievement = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding();
    },
    render: function () {
        var self = this,
            binding = self.getDefaultBinding();
        return (
            <div>
                <If condition={binding.get('activeChildId')==='all'}>
                    <AchievementsAllChildren binding={binding} />
                </If>
                <If condition={binding.get('activeChildId') !== 'all'}>
                    <AchievementOneChild binding={binding} />
                </If>
            </div>
        )
    }
});
module.exports = ParentChildAchievement;
