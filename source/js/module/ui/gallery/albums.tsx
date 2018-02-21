/**
 * Created by Anatoly on 09.02.2016.
 */

import * as RouterView from 'module/core/router';
import * as Route from 'module/core/route';
import * as Morearty from 'morearty';
import * as React from 'react';

import {AlbumEditComponent} from "module/ui/gallery/album/album_edit";
import {AlbumCreateComponent} from "module/ui/gallery/album/album_create";
import {AlbumViewComponent} from "module/ui/gallery/album/album_view";
import {PhotoEditComponent} from "module/ui/gallery/photo/photo_edit";
import {PhotoAddComponent} from "module/ui/gallery/photo/photo_add";
import {AddAnonymousIcon} from "module/ui/gallery/add_anonumous_icon";

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
					path 		= { "/" + this.props.basePath + "/edit/:albumId" }
					binding 	= { binding }
					service 	= { this.props.service }
					component 	= { AlbumEditComponent }
				/>
				<Route
					path 		= { "/" + this.props.basePath + "/create" }
					binding 	= { binding }
					service 	= { this.props.service }
					component 	= { AlbumCreateComponent }
				/>
				<Route
					path 		= { "/" + this.props.basePath + "/view/:albumId" }
					binding 	= { binding }
					service 	= { this.props.service }
					component 	= { AlbumViewComponent }
				/>
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
				<Route
					path 		= { "/" + this.props.basePath + "/:albumId/photo-add-icon/:photoId" }
					service 	= { this.props.service }
					binding 	= { binding }
					component 	= { AddAnonymousIcon }
				/>
			</RouterView>
		);
	}
});
