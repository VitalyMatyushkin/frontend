export const PlaceHelper = {
	/*
	 Cuts url for schoolUnion(school_union_console/venues/add ...) and school so that
	 it leads to school_union_console/venues or school_console/venues
	 */
	redirectToPlaceListPage() {
		document.location.hash = document.location.hash.split('/').slice(0, 2).join('/');
	}
};