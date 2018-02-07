/**
 * Created by vitaly on 22.12.17.
 */

import * as	Immutable from 'immutable';
import * as	Lazy from 'lazy.js';
import * as	BPromise from 'bluebird';
import {ServiceList} from "module/core/service_list/service_list";
import {Sport} from "module/models/sport/sport";

const eventsCountOnPage = 20;
const eventsCountLimit = 20;

export class AchievementActions {
	static getChildSports(binding, schoolId: string,childId: string, type: 'STUFF'|'PARENT'|'STUDENT') {
		const setSports = (sports: Sport[]) => {
			const uniqueSports = (Lazy(sports) as any).uniq('id').toArray();
			binding.set('achievementSports', Immutable.fromJS(uniqueSports));
			binding.set('currentAchievementSport', Immutable.fromJS(uniqueSports[0]));
			binding.set('isSyncAchievementSports', true);

			return true;
		};


		switch(type) {
			case 'STUFF': {
				const filterSport = {
					filter: {
						where: {
							typeOfPlayers: 'TEAM'
						},
						limit: 10000
					}
				};

				return (window.Server as ServiceList).schoolStudentSports.get({schoolId, studentId: childId}, filterSport)
					.then(sports => setSports(sports));
			}
			case 'PARENT': {
				const filterSport = {
					filter: {
						where: {typeOfPlayers: 'TEAM'},
						limit: 10000
					}
				};

				return (window.Server as ServiceList).childSports.get({childId: childId}, filterSport)
					.then(sports => setSports(sports));
			}
			case 'STUDENT': {
				const filterSport = {
					filter: {
						where: {
							typeOfPlayers: 'TEAM',
							schoolIdList: [schoolId]
						},
						limit: 10000
					}
				};

				return (window.Server as ServiceList).studentSports.get({childId: childId}, filterSport)
					.then(sports => setSports(sports));
			}
		}
	}
	
	static getChildAchievements(binding, schoolId: string, childId: string, sportId: string, type: 'STUFF'|'PARENT'|'STUDENT') {
		const setAchievements = (achievements) => {
			binding
				.atomically()
				.set('childAchievement', Immutable.fromJS(achievements))
				.commit();
		};

		switch(type) {
			case 'STUFF': {
				const filterAchievements = {
					filter: {
						where: {
							sportId: sportId
						},
						limit: 1000
					}
				};

				(window.Server as ServiceList).schoolStudentAchievements.get({schoolId, studentId: childId}, filterAchievements)
					.then(achievement => setAchievements(achievement));

				break;
			}
			case 'PARENT': {
				const filterAchievements = {
					filter: {
						where: {
							sportId: sportId
						},
						limit: 1000
					}
				};

				(window.Server as ServiceList).childAchievements.get({childId: childId}, filterAchievements)
					.then(achievement => setAchievements(achievement));
				break;
			}
			case 'STUDENT': {
				const filterAchievements = {
					filter: {
						where: {
							sportId: sportId,
							schoolIdList: [schoolId]
						},
						limit: 1000
					}
				};

				(window.Server as ServiceList).studentAchievements.get(filterAchievements)
					.then(achievement => setAchievements(achievement));
				break;
			}
		}
	}
	
	static getAllChildrenSports(binding, childrenIds: string[], type: 'STUFF'|'PARENT'|'STUDENT') {
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
	
	static getChildrenAchievements(binding, childrenIds: string[], sportId: string, type: 'STUFF'|'PARENT'|'STUDENT') {
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
	
	static getChildTeamEvents(page: number, schoolId: string, childId: string, sportId: string, result: string, type: 'STUFF'|'PARENT'|'STUDENT') {
		switch(type) {
			case 'STUFF': {
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

				return (window.Server as ServiceList).schoolStudentTeamEvents.get({schoolId, studentId: childId, sportId}, filterEvents);
			}
			case 'PARENT': {
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

				return (window.Server as ServiceList).childTeamEvents.get({childId, sportId}, filterEvents);
			}
			case 'STUDENT': {
				const filterEvents = {
					filter: {
						where: {
							result: result,
							schoolIdList: [schoolId]
						},
						skip: eventsCountOnPage * (page - 1),
						limit: eventsCountLimit,
						order: 'startTime DESC',
					}
				};

				return (window.Server as ServiceList).studentTeamEvents.get({sportId}, filterEvents);
			}
		}
	}
}