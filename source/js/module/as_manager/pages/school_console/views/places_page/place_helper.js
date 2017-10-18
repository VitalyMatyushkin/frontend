/**
 * Created by vitaly on 18.10.17.
 */

const PlaceHelper = {
	/*
	 Cuts url for schoolUnion(school_union_console/venues/add ...) and school so that
	 it leads to school_union_console/venues or school_console/venues
	 */
	redirectToPlaceListPage: function() {
		document.location.hash = document.location.hash.split('/').slice(0, 2).join('/');
	}
};

module.exports = PlaceHelper;