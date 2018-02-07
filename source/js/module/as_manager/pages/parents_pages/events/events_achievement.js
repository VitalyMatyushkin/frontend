/**
 * Created by bright boahen on 02/06/15.
 */
const	React						= require('react'),
		Morearty					= require('morearty'),

		{If}						= require('module/ui/if/if'),

		{AchievementAllChildren}	= require('./achievement/achievements_all_children'),
		{AchievementOneChild}		= require('./achievement/achievement_one_child');

const ParentChildAchievement = React.createClass({
	mixins: [Morearty.Mixin],
	
	render: function () {
		const binding = this.getDefaultBinding();
		
		return (
			<div>
				<If condition={binding.get('activeChildId')==='all'}>
					<AchievementAllChildren
						children	= {binding.toJS('children')}
						binding		= {binding.sub('allChildrenAchievements')}
					/>
				</If>
				<If condition={binding.get('activeChildId') !== 'all'}>
					<AchievementOneChild
						activeChildId	= {binding.get('activeChildId')}
						children		= {binding.toJS('children')}
						binding			= {binding.sub('oneChildAchievements')}
						type            = {'PARENT'}
					/>
				</If>
			</div>
		)
	}
});

module.exports = ParentChildAchievement;