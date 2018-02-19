import * as Immutable from 'immutable';
import {EVENT_FORM_MODE} from 'module/as_manager/pages/events/manager/event_form/consts/consts';

export class EventFormActions {
	static getSportService(schoolId: string, isOnlyFavoriteSports: boolean, mode: string) {
		return (sportName) => {
			let filter;

			if(isOnlyFavoriteSports) {
				filter = {
					filter: {
						where: {
							name: {
								like: sportName,
								options: 'i'
							},
							isFavorite: isOnlyFavoriteSports
						},
						limit: 50,
						order:'name ASC'
					}
				}
			} else {
				filter = {
					filter: {
						where: {
							name: {
								like: sportName,
								options: 'i'
							}
						},
						limit: 50,
						order:'name ASC'
					}
				}
			}

			if(mode && mode === EVENT_FORM_MODE.SCHOOL_UNION) {
				filter.filter.where['points.display'] = {$nin: 'PRESENCE_ONLY'};
			}

			return (window as any).Server.schoolSports.get(schoolId, filter);
		};
	}

	static getSports(activeSchoolId: string) {
		return (window as any).Server.schoolSports.get(
			activeSchoolId,
			{
				filter: {
					limit: 100
				}
			}
		);
	}

	static setSports(activeSchoolId: string, binding: any) {
		return this.getSports(activeSchoolId)
			.get(
				activeSchoolId,
				{
					filter: {
						limit: 100
					}
				}
			)
			.then(
				sports => binding.atomically()
					.set('sports.sync',		true)
					.set('sports.models',	Immutable.fromJS(sports))
					.commit()
			);
	}
}