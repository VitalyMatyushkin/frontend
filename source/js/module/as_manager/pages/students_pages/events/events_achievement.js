/**
 * Created by bright boahen on 02/06/15.
 */
const	React						= require('react'),
		Morearty					= require('morearty'),

	{If}						= require('module/ui/if/if'),

		AchievementsAllSchool		= require('./achievement/achievements_all_school'),
		AchievementOneSchool		= require('./achievement/achievement_one_school');

const EventsAchievementComponent = React.createClass({
	mixins: [Morearty.Mixin],
	render: function () {
		const binding = this.getDefaultBinding();
		return (
			<div>
				<If condition={binding.get('activeSchoolId')==='all'}>
					<AchievementsAllSchool binding={binding} />
				</If>
				<If condition={binding.get('activeSchoolId') !== 'all'}>
					<AchievementOneSchool binding={binding} />
				</If>
			</div>
		)
	}
});

module.exports = EventsAchievementComponent;