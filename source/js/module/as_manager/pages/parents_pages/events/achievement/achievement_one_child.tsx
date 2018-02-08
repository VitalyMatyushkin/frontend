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

export const AchievementOneChild = (React as any).createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		schoolId: (React as any).PropTypes.string,
		activeChildId: (React as any).PropTypes.string.isRequired,
		children: (React as any).PropTypes.array.isRequired,
		type: (React as any).PropTypes.string.isRequired
	},
	componentWillMount:function(){
		const binding = this.getDefaultBinding();
		
		this.activeChildId = this.props.activeChildId;

		binding.sub('currentAchievementSport').addListener(eventDescriptor => {
			if (typeof eventDescriptor.getCurrentValue() !== 'undefined') {
				const sportId = eventDescriptor.getCurrentValue().toJS().id;

				binding.set('showChildEvents', false);
				AchievementActions.getChildAchievements(binding, this.props.schoolId, this.activeChildId, sportId, this.props.type);
			}
		});

		AchievementActions.getChildSports(binding, this.props.schoolId, this.activeChildId, this.props.type);
	},
	
	componentWillUnmount:function() {
		const binding = this.getDefaultBinding();
		binding.clear();
	},
	
	componentWillReceiveProps: function(newProps) {
		const binding = this.getDefaultBinding();
		if (newProps.activeChildId !== this.activeChildId) {
			this.activeChildId = newProps.activeChildId;
			binding.set('showChildEvents', false);
			AchievementActions.getChildSports(binding, this.props.schoolId, newProps.activeChildId, this.props.type);
		}
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
				<AchievementTable
					achievement={binding.toJS('childAchievement')}
					children={this.props.children}
					showEvents={this.showEvents}
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
		const 	binding = this.getDefaultBinding(),
				sportIsSync = binding.toJS('isSyncAchievementSports');
		
		if (sportIsSync) {
			if (typeof binding.toJS('currentAchievementSport') !== 'undefined') {
				return (
					<div className="eAchievementTable_body">
						{this.renderSportSelector()}
						{this.renderAchievementTable()}
						{this.renderEvents()}
					</div>
				)
			} else {
				return <div className="eAchievementMessage">No achievements</div>
			}
		} else {
			return(
				<div className='bLoaderWrapper'>
					<Loader condition={ true }/>
				</div>
			);
		}
	}
});
