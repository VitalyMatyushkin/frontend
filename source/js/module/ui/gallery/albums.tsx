/**
 * Created by Anatoly on 09.02.2016.
 */

import * as RouterView from 'module/core/router';
import * as Route from 'module/core/route';
import * as Morearty from 'morearty';
import * as React from 'react';

import {PhotoEditComponent} from "module/ui/gallery/photo/photo_edit";
import {PhotoAddComponent} from "module/ui/gallery/photo/photo_add";

/**
 * The base component for routing the functions of the gallery.
 *
 * @param basePath {string} - Base path to the gallery. It depends on where the gallery is used.
 * For example, 'event-album/:eventId'
 *
 * @param service {galleryServices} - service for the work gallery with the server-API.
 * */
interface AlbumRoutesProps {
	basePath: 	string,
	service: 	any
}

export const AlbumRoutes = (React as any).createClass({
	mixins: [Morearty.Mixin],
	
	getDefaultProps: function() {
		return {
			basePath: 'gallery-not-found'
		};
	},
	
	render: function() {
		const 	binding = this.getDefaultBinding();
		
		binding.set('basePath', this.props.basePath);
		
		return (
			<RouterView
				routes 	= { this.getMoreartyContext().getBinding() }
				binding = { this.getMoreartyContext().getBinding() }
			>
				<Route
					path 		= { "/" + this.props.basePath + "/view/:albumId/add" }
					binding 	= { binding }
					service 	= { this.props.service }
					component 	= { PhotoAddComponent }
				/>
				<Route
					path 		= { "/" + this.props.basePath + "/:albumId/photo-edit/:photoId" }
					service 	= { this.props.service }
					binding 	= { binding }
					component 	= { PhotoEditComponent }
				/>
			</RouterView>
		);
	}
});
