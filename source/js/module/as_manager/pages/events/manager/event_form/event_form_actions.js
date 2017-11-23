const Immutable = require('immutable');

const EventFormActions = {
	getSportService: function(schoolId, isOnlyFavoriteSports) {
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