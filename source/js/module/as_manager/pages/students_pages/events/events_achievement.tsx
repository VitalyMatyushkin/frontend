import * as React from 'react'
import * as Morearty from 'morearty'
import {If} from 'module/ui/if/if'

import * as AchievementsAllSchool from './achievement/achievements_all_school'
import {AchievementOneSchool} from './achievement/achievement_one_school'

export const EventsAchievementComponent = (React as any).createClass({
	mixins: [Morearty.Mixin],
	render() {
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
})