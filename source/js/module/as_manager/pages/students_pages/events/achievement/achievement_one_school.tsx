import * as React from 'react'
import * as Morearty from 'morearty'
import * as Immutable from 'immutable'
import * as Loader from 'module/ui/loader';
import * as StudentHelper from 'module/helpers/studentHelper'

import {AchievementOneChild} from "module/as_manager/pages/parents_pages/events/achievement/achievement_one_child";

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
		binding.set('studentProfile', undefined);

		if(!schoolId) {
			document.location.hash = 'events/calendar/all';
		} else if(schoolId && schoolId !=='all') {
			StudentHelper.getStudentProfile(schoolId)
				.then(studentProfile => binding.set('studentProfile', Immutable.fromJS(studentProfile)));
		}
	},
	render() {
		const binding = this.getDefaultBinding();

		// TODO just listen activeSchoolId changes by addListener
		if(this.activeSchoolId !== binding.get('activeSchoolId')){
			this.updateViewOnActiveSchoolIdChange();
			this.activeSchoolId = binding.get('activeSchoolId');
		}
		
		const studentProfile = binding.toJS('studentProfile');
		if(typeof studentProfile !== 'undefined') {
			return (
				<AchievementOneChild
					schoolId={this.activeSchoolId}
					activeChildId={studentProfile.id}
					children={[studentProfile]}
					binding={binding.sub('achievementOneSchool')}
					type={'STUDENT'}
				/>
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