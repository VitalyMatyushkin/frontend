/**
 * Created by bright boahen on 02/06/15.
 */
const	React						= require('react'),
		Morearty					= require('morearty'),

	{If}						= require('module/ui/if/if'),

		AchievementsAllChildren		= require('./achievement/achievements_all_children'),
		AchievementOneChild			= require('./achievement/achievement_one_child');

const ParentChildAchievement = React.createClass({
	mixins: [Morearty.Mixin],
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