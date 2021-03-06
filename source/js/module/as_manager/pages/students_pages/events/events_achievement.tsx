import * as React from 'react'
import * as Morearty from 'morearty'
import {If} from 'module/ui/if/if'

import * as AchievementsAllSchoolWrapper from 'module/as_manager/pages/students_pages/events/achievement/achievements_all_school_wrapper'
import {AchievementOneSchool} from './achievement/achievement_one_school'

export const EventsAchievementComponent = (React as any).createClass({
	mixins: [Morearty.Mixin],
	componentWillMount() {
		const binding = this.getDefaultBinding();
		const schoolIdList = binding.toJS('schoolIds');

		const activeSchoolId = schoolIdList[0];
		window.location.hash = `events/achievement/${activeSchoolId}`;
		binding.set('activeSchoolId', activeSchoolId);
	},
	render() {
		const binding = this.getDefaultBinding();

		return (
			<div>
				<If condition={binding.get('activeSchoolId')==='all'}>
					<AchievementsAllSchoolWrapper binding={binding}/>
				</If>
				<If condition={binding.get('activeSchoolId') !== 'all'}>
					<AchievementOneSchool binding={binding}/>
				</If>
			</div>
		);
	}
});