/**
 * Created by Anatoly on 17.03.2016.
 */

import * as	React from 'react';
import * as	Morearty from 'morearty';
import * as	Immutable from 'immutable';
import {AchievementSportSelect} from './achievement_sport_select';
import {AchievementTable} from './achievement_table';
import {AchievementActions}	from './achievement_actions';
import * as Loader from 'module/ui/loader';
import {titleToFilterResultType} from './achievement_helper';
import {ChildrenEvents} from './children_events';
import 'styles/pages/event/b_achievement.scss';

export const AchievementAllChildren = (React as any).createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		schoolId: (React as any).PropTypes.string,
		children: (React as any).PropTypes.bool.isRequired,
		type: (React as any).PropTypes.string.isRequired
	},
	componentWillMount:function(){
		const 	binding 	= this.getDefaultBinding(),
				children	= this.props.children,
				ids			= children && children.map(ch => ch.id);
		
		AchievementActions.getAllChildrenSports(binding, ids, this.props.type);
		binding.sub('currentAchievementSport').addListener(eventDescriptor => {
			if (typeof eventDescriptor.getCurrentValue() !== 'undefined') {
				const sportId = eventDescriptor.getCurrentValue().toJS().id;
				binding.set('showChildEvents', false);
				AchievementActions.getChildrenAchievements(binding, ids, sportId, this.props.type);
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
		if (typeof binding.toJS('childrenAchievement') !== 'undefined') {
			return (
				<AchievementTable
					achievement	={ binding.toJS('childrenAchievement') }
					children	={ this.props.children }
					showEvents	={ this.showEvents }
				/>
			);
		} else {
			return null;
		}
	},
	
	showEvents: function(title: string, childId: string): void {
		const 	binding = this.getDefaultBinding();
		binding.set('showChildEvents', true);
		binding.set('typeChildEvents', Immutable.fromJS(title));
		binding.set('childIdForEvents', Immutable.fromJS(childId));
	},
	
	renderEvents: function(): React.ReactNode | null {
		const 	binding 		= this.getDefaultBinding(),
				rootBinding 	= this.getMoreartyContext().getBinding(),
				activeSchoolId 	= rootBinding.get('userRules.activeSchoolId'),
				typeChildEvents	= binding.toJS('typeChildEvents'),
				childId			= binding.toJS('childIdForEvents'),
				sportId 		= binding.toJS('currentAchievementSport').id,
				result 			= titleToFilterResultType[typeChildEvents];
		
		if (binding.toJS('showChildEvents')) {
			return (
				<ChildrenEvents
					key				= { `${childId}_${sportId}_${result}` }
					activeSchoolId 	= { activeSchoolId }
					childId			= { childId }
					loadEvents		= { page =>
						AchievementActions.getChildTeamEvents(page, this.props.schoolId, childId, sportId, result, this.props.type)
					}
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
