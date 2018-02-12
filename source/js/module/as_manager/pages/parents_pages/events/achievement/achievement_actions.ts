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
	static getChildSports(binding, schoolId: string,childId: string, type: 'STUFF'|'PARENT'|'STUDENT'): BPromise<Sport[]> {
		const setSports = (sports: Sport[]) => {
			const uniqueSports = (Lazy(sports) as any).uniq('id').toArray();
			binding.set('achievementSports', Immutable.fromJS(uniqueSports));
			binding.set('currentAchievementSport', Immutable.fromJS(uniqueSports[0]));
			binding.set('isSyncAchievementSports', true);

			return BPromise.resolve(sports);
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
	
	static getChildAchievements(
		binding,
		schoolId: string,
		childId: string,
		sportId: string,
		type: 'STUFF'|'PARENT'|'STUDENT'
	): BPromise<any[]> {
		const setAchievements = (achievements) => {
			binding.set('childAchievement', Immutable.fromJS(achievements));

			return BPromise.resolve(achievements);
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

				return (window.Server as ServiceList).schoolStudentAchievements.get({schoolId, studentId: childId}, filterAchievements)
					.then(achievement => setAchievements(achievement));
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

				return (window.Server as ServiceList).childAchievements.get({childId: childId}, filterAchievements)
					.then(achievement => setAchievements(achievement));
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

				return (window.Server as ServiceList).studentAchievements.get(filterAchievements)
					.then(achievement => setAchievements(achievement));
			}
		}
	}

	static getAllSchoolsChildAchievements(binding, schoolIds: string[], sportId: string,) {
		const setAchievements = (achievements) => {
			binding.set('childAchievement', Immutable.fromJS(achievements));

			console.log(achievements);

			return achievements;
		};

		const filterAchievements = {
			filter: {
				where: {
					sportId: sportId,
					schoolIdList: schoolIds
				},
				limit: 1000
			}
		};

		return (window.Server as ServiceList).studentAchievements.get(filterAchievements)
			.then(achievement => setAchievements(achievement));
	}
	
	static getAllChildrenSports(binding, childrenIds: string[], type: 'STUFF'|'PARENT'|'STUDENT'): BPromise<Sport[]> {
		const filterSport = {
			filter: {
				where: {
					childIdList: childrenIds,
					typeOfPlayers: 'TEAM'
				},
				limit: 10000
			}
		};
		
		return (window.Server as ServiceList).childrenSports.get(filterSport)
			.then(sports => {
				const uniqueSports = (Lazy(sports) as any).uniq('id').toArray();

				binding
					.atomically()
					.set('achievementSports', Immutable.fromJS(uniqueSports))
					.set('currentAchievementSport', Immutable.fromJS(uniqueSports[0]))
					.set('isSyncAchievementSports', true)
					.commit();

				return BPromise.resolve(sports);
			});
	}

	static getAllSchoolsChildSports(binding, schoolIds: string[]): BPromise<Sport[]> {
		const filterSport = {
			filter: {
				where: {
					typeOfPlayers: 'TEAM',
					schoolIdList: schoolIds
				},
				limit: 10000
			}
		};

		return (window.Server as ServiceList).studentSports.get(filterSport)
			.then(sports => {
				const uniqueSports = (Lazy(sports) as any).uniq('id').toArray();
				binding
					.atomically()
					.set('achievementSports', Immutable.fromJS(uniqueSports))
					.set('currentAchievementSport', Immutable.fromJS(uniqueSports[0]))
					.set('isSyncAchievementSports', true)
					.commit();

				return BPromise.resolve(sports);
			});
	}
	
	static getChildrenAchievements(
		binding,
		childrenIds: string[],
		sportId: string,
		type: 'STUFF'|'PARENT'|'STUDENT'
	): BPromise<any> {
		const filterAchievements = {
			filter: {
				where: {
					childIdList: childrenIds,
					sportId: sportId
				},
				limit: 1000
			}
		};
		
		return (window.Server as ServiceList).childrenAchievements.get(filterAchievements)
			.then(achievement => {
				binding.set('childrenAchievement', Immutable.fromJS(achievement));

				return BPromise.resolve(achievement);
			});
	}
	
	static getChildTeamEvents(
		page: number,
		schoolId: string,
		childId: string,
		sportId: string,
		result: string,
		type: 'STUFF'|'PARENT'|'STUDENT'
	): BPromise<any[]> {
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

				return (window.Server as ServiceList).schoolStudentTeamEvents.get(
					{schoolId, studentId: childId, sportId},
					filterEvents
				);
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

				return (window.Server as ServiceList).childTeamEvents.get(
					{childId, sportId},
					filterEvents
				);
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

				return (window.Server as ServiceList).studentTeamEvents.get(
					{sportId},
					filterEvents
				);
			}
		}
	}
}