/**
 * Created by vitaly on 16.10.17.
 */
const	React		= require('react'),
		Morearty	= require('morearty'),
		RouterView	= require('module/core/router'),
		Route		= require('module/core/route');

const	PlaceList	= require('module/as_manager/pages/school_console/views/places_page/place_list'),
		PlaceView	= require('module/as_manager/pages/school_console/views/places_page/place_view'),
		PlaceEdit	= require('module/as_manager/pages/school_console/views/places_page/place_edit'),
		PlaceAdd	= require('module/as_manager/pages/school_console/views/places_page/place_add');

const PlacesPage = React.createClass({
	mixins: [Morearty.Mixin],
	//The function, which will call when user click on <Row> in Grid
	handleClick: function(place) {
		document.location.hash += `/edit?id=${place}`;
	},
	render: function() {
		const	binding 		= this.getDefaultBinding(),
				globalBinding	= this.getMoreartyContext().getBinding();

		return (
			<RouterView	routes	= { binding.sub('placesRouting') }
						   binding	= { globalBinding }
			>
				<Route
					path		= "/school_union_console/venues"
					binding		= { binding.sub('placeList') }
					component	= { PlaceList }
					handleClick	= { this.handleClick }
				/>
				<Route
					path		= "/school_union_console/venues/add"
					binding		= { binding.sub('placeFormWrapper') }
					component	= { PlaceAdd }
				/>
				<Route
					path		= "/school_union_console/venues/edit"
					binding		= { binding.sub('placeFormWrapper') }
					component	= { PlaceEdit }
				/>
				<Route
					path		= "/school_union_console/venues/view"
					binding		= { binding.sub('placeView') }
					component	= { PlaceView }
				/>
			</RouterView>
		)
	}
});

module.exports = PlacesPage;