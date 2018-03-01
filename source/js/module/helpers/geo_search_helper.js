const {LocalEventHelper} = require('module/as_manager/pages/events/eventHelper');

const MILES_TO_METERS = 1609.344;

const GeoSearchHelper = {
	getMainGeoSchoolFilterByParams: function(distance, point) {
		switch (distance) {
			case "UNLIMITED":
				return this.getUnlimitedGeoSchoolFilter(point);
			default:
				return this.getGeoSchoolWithDistanceFilter(distance, point);
		}
	},
	getUnlimitedGeoSchoolFilter: function(point) {
		return {
			$nearSphere: {
				$geometry: {
					type: 'Point',
					coordinates: [point.lng, point.lat]
				}
			}
		};
	},
	getGeoSchoolWithDistanceFilter: function(distance, point) {
		const filter = this.getUnlimitedGeoSchoolFilter(point);

		filter['$nearSphere']['$maxDistance'] = LocalEventHelper.distanceItems.find(i => i.id === distance).value * MILES_TO_METERS;

		return filter;
	}
};

module.exports = GeoSearchHelper;