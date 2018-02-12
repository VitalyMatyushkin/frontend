import * as React from 'react'
import * as Morearty from 'morearty'
import * as Immutable from 'immutable'
import * as Loader from 'module/ui/loader';
import * as StudentHelper from 'module/helpers/studentHelper'

import * as AchievementStatisticView from "module/as_manager/pages/students_pages/events/achievement/view/achievement-statistic-view";

export const AchievementOneSchool = (React as any).createClass({
	mixins: [Morearty.Mixin],
	componentWillMount() {
		const binding = this.getDefaultBinding();
		this.activeSchoolId = binding.get('activeSchoolId');

		this.updateViewOnActiveSchoolIdChange();
	},
	updateViewOnActiveSchoolIdChange() {
		const binding = this.getDefaultBinding();

		const schoolId = binding.get('activeSchoolId');
		binding.set('achievementStatisticView', Immutable.fromJS({}));
		binding.set('achievementStatisticView.achievements', undefined);

		if(!schoolId) {
			document.location.hash = 'events/calendar/all';
		} else if(schoolId && schoolId !=='all') {
			StudentHelper.getStudentProfile(schoolId)
				.then(achievements => binding.set('achievementStatisticView.achievements', Immutable.fromJS(achievements)));
		}
	},
	render() {
		const binding = this.getDefaultBinding();

		// TODO just listen activeSchoolId changes by addListener
		if(this.activeSchoolId !== binding.get('activeSchoolId')){
			this.updateViewOnActiveSchoolIdChange();
			this.activeSchoolId = binding.get('activeSchoolId');
		}
		
		const achievements = binding.toJS('achievementStatisticView.achievements');
		if(typeof achievements !== 'undefined') {
			return (
				<AchievementStatisticView
					activeSchoolId={this.activeSchoolId}
					binding={binding.sub('achievementStatisticView')}/>
			);
		} else {
			return (
				<div className="eAchievementMessage">
					<Loader condition={true}/>
				</div>
			);
		}
	}
});