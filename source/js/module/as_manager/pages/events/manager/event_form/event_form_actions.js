const 	Immutable 		= require('immutable'),
		EventFormConsts	= require('module/as_manager/pages/events/manager/event_form/consts/consts');

const EventFormActions = {
	getSportService: function(schoolId, isOnlyFavoriteSports, mode) {
		return (sportName) => {
			const filter = {
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
			};

			if(isOnlyFavoriteSports) {
				filter.filter.where.isFavorite = isOnlyFavoriteSports;
			}
			
			if(mode && mode === EventFormConsts.EVENT_FORM_MODE.SCHOOL_UNION) {
				filter.filter.where['points.display'] = {$nin: 'PRESENCE_ONLY'};
			}

			return window.Server.schoolSports.get(schoolId, filter);
		};
	},
	getSports: function (activeSchoolId) {
		return window.Server.schoolSports.get(
				activeSchoolId,
				{
					filter: {
						limit: 100
					}
				}
			);
	},
	setSports: function(activeSchoolId, binding) {
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
};

module.exports = EventFormActions;