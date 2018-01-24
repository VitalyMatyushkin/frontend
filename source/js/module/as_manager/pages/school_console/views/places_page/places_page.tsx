import * as React from 'react'
import * as Morearty from 'morearty'

import * as RouterView from 'module/core/router'
import * as Route from 'module/core/route'

import {PlaceList} from 'module/as_manager/pages/school_console/views/places_page/place_list'
import {PlaceEdit} from 'module/as_manager/pages/school_console/views/places_page/place_edit'
import {PlaceAdd} from 'module/as_manager/pages/school_console/views/places_page/place_add'

export const PlacesPage = (React as any).createClass({
	mixins: [Morearty.Mixin],

	//The function, which will call when user click on <Row> in Grid
	handleClick(place: string) {
		document.location.hash += `/edit?id=${place}`;
	},

	render() {
		const	binding 		= this.getDefaultBinding(),
				globalBinding	= this.getMoreartyContext().getBinding();

		return (
			<RouterView	routes	= { binding.sub('placesRouting') }
						binding	= { globalBinding }
			>
				<Route
					path		= "/school_console/venues"
					binding		= { binding.sub('placeList') }
					component	= { PlaceList }
					handleClick	= { this.handleClick }
				/>
				<Route
					path		= "/school_console/venues/add"
					binding		= { binding.sub('placeFormWrapper') }
					component	= { PlaceAdd }
				/>
				<Route
					path		= "/school_console/venues/edit"
					binding		= { binding.sub('placeFormWrapper') }
					component	= { PlaceEdit }
				/>
			</RouterView>
		)
	}
});