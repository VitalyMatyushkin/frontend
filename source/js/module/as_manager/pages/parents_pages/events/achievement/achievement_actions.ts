/**
 * Created by vitaly on 22.12.17.
 */

import * as	Immutable from 'immutable';
import * as	Lazy from 'lazy.js';
import {ServiceList} from "module/core/service_list/service_list";

const eventsCountOnPage = 20;
const eventsCountLimit = 20;

export class AchievementActions {
	static getChildSports(binding, childId: string) {
		const filterSport = {
			filter: {
				where: {typeOfPlayers: 'TEAM'},
				limit: 10000
			}
		};

		(window.Server as ServiceList).childSports.get({childId: childId}, filterSport)
			.then(sports => {
				const uniqueSports = (Lazy(sports) as any).uniq('id').toArray();
				binding
					.atomically()
					.set('achievementSports', Immutable.fromJS(uniqueSports))
					.set('currentAchievementSport', Immutable.fromJS(uniqueSports[0]))
					.set('isSyncAchievementSports', true)
					.commit();
			});
	}
	
	static getChildAchievements(binding, childId: string, sportId: string) {
		const filterAchievements = {
			filter: {
				where: {
					sportId: sportId
				},
				limit: 1000
			}
		};

		(window.Server as ServiceList).childAchievements.get({childId: childId}, filterAchievements)
			.then(achievement => {
				binding
					.atomically()
					.set('childAchievement', Immutable.fromJS(achievement))
					.commit();
			});
	}
	
	static getAllChildrenSports(binding, childrenIds: string[]) {
		const filterSport = {
			filter: {
				where: {
					childIdList: childrenIds,
					typeOfPlayers: 'TEAM'
				},
				limit: 10000
			}
		};
		
		(window.Server as ServiceList).childrenSports.get(filterSport)
			.then(sports => {
				const uniqueSports = (Lazy(sports) as any).uniq('id').toArray();
				binding
					.atomically()
					.set('achievementSports', Immutable.fromJS(uniqueSports))
					.set('currentAchievementSport', Immutable.fromJS(uniqueSports[0]))
					.set('isSyncAchievementSports', true)
					.commit();
			});
	}
	
	static getChildrenAchievements(binding, childrenIds: string[], sportId: string) {
		const filterAchievements = {
			filter: {
				where: {
					childIdList: childrenIds,
					sportId: sportId
				},
				limit: 1000
			}
		};
		
		(window.Server as ServiceList).childrenAchievements.get(filterAchievements)
			.then(achievement => {
				binding
					.atomically()
					.set('childrenAchievement', Immutable.fromJS(achievement))
					.commit();
			});
	}
	
	static getChildTeamEvents(page: number, childId: string, sportId: string, result: string) {
		const filterEvents = {
			filter: {
				where: {
					result: result
				},
				skip: eventsCountOnPage * (page - 1),
				limit: eventsCountLimit,
				order: 'startTime DESC',
			}
		};
		return (window.Server as ServiceList).childTeamEvents.get({childId, sportId},filterEvents)
	}
}