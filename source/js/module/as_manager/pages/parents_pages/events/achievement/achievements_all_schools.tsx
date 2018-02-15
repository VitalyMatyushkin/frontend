/**
 * Created by Anatoly on 17.03.2016.
 */

import * as	React from 'react';
import * as	Morearty from 'morearty';
import * as	Immutable from 'immutable';

import * as Loader from 'module/ui/loader';

import {AchievementSportSelect} from './achievement_sport_select';
import {AchievementAllSchoolTable} from "module/as_manager/pages/parents_pages/events/achievement/achievement_all_school_table";
import {AchievementActions}	from './achievement_actions';
import {ChildrenEvents} from './children_events';

import {titleToFilterResultType} from './achievement_helper';

import 'styles/pages/event/b_achievement.scss';

export const AchievementAllSchools = (React as any).createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		student:(React as any).PropTypes.object.isRequired,
		schools: (React as any).PropTypes.array.isRequired
	},
	componentWillMount:function() {
		const binding = this.getDefaultBinding();
		const schoolIds = this.props.schools.map(ch => ch.id);
		
		AchievementActions.getAllSchoolsChildSports(binding, schoolIds);
		binding.sub('currentAchievementSport').addListener(eventDescriptor => {
			if (typeof eventDescriptor.getCurrentValue() !== 'undefined') {
				const sportId = eventDescriptor.getCurrentValue().toJS().id;
				binding.set('showChildEvents', false);
				AchievementActions.getAllSchoolsChildAchievements(binding, schoolIds, sportId);
			}
		});
	},
	
	componentWillUnmount:function() {
		const binding = this.getDefaultBinding();
		binding.clear();
	},

	renderSportSelector: function(): React.ReactNode {
		const binding = this.getDefaultBinding();
		return (
			<AchievementSportSelect binding={binding}/>
		);
	},

	renderAchievementTable: function(): React.ReactNode | null {
		const binding = this.getDefaultBinding();
		if (typeof binding.toJS('childAchievement') !== 'undefined') {
			return (
				<AchievementAllSchoolTable
					schools={this.props.schools}
					achievements={binding.toJS('childAchievement')}
					showEvents={this.showEvents}
				/>
			);
		} else {
			return null;
		}
	},
	
	showEvents: function(title: string, childId: string, schoolId: string): void {
		const 	binding = this.getDefaultBinding();
		binding.set('showChildEvents', true);
		binding.set('typeChildEvents', Immutable.fromJS(title));
		binding.set('childIdForEvents', Immutable.fromJS(childId));
		binding.set('schoolIdForEvents', Immutable.fromJS(schoolId));
	},
	
	renderEvents: function(): React.ReactNode | null {
		const 	binding 		= this.getDefaultBinding(),
				typeChildEvents	= binding.toJS('typeChildEvents'),
				schoolId        = binding.toJS('schoolIdForEvents'),
				childId         = binding.toJS('childIdForEvents'),
				sportId 		= binding.toJS('currentAchievementSport').id,
				result 			= titleToFilterResultType[typeChildEvents];
		
		if (binding.toJS('showChildEvents')) {
			return (
				<ChildrenEvents
					key				= { `${childId}_${sportId}_${result}` }
					activeSchoolId 	= { schoolId }
					childId			= { childId }
					loadEvents		= { page => {
						return AchievementActions.getChildTeamEvents(page, schoolId, childId, sportId, result, 'STUDENT')
					}}
				/>
			);
		} else {
			return null;
		}
	},
	
	render: function () {
		const 	binding 	= this.getDefaultBinding(),
				sportIsSync = binding.toJS('isSyncAchievementSports');
		
		if (sportIsSync) {
			if (typeof binding.toJS('currentAchievementSport') !== 'undefined') {
				return (
					<div className="eAchievementTable_body">
						<div className="container">
							<div className="row">
								<div className="col-md-12">
									{this.renderSportSelector()}
									{this.renderAchievementTable()}
									{this.renderEvents()}
								</div>
							</div>
						</div>
					</div>
				)
			} else {
				return <div className="eAchievementMessage">No achievements</div>
			}
		} else {
			return(
				<div className="eAchievementMessage">
					<Loader condition={true}/>
				</div>
			);
		}
	}
});
