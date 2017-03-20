const EventFormActions = {
	getSportService: function(schoolId, isOnlyFavoriteSports) {
		return (sportName) => {
			const filter = {
				where: {
					name: {
						like: sportName,
						options: 'i'
					}
				},
				limit: 50,
				order:'name ASC'
			};

			if(isOnlyFavoriteSports) {
				filter.where.isFavorite = isOnlyFavoriteSports;
			}

			return window.Server.schoolSports.get(schoolId, filter);
		};
	}
};

module.exports = EventFormActions;