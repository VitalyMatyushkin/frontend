import * as Immutable from 'immutable';
import * as React from 'react';
import * as Morearty from 'morearty';
import {SchoolGallery} from './school_gallery';
import * as Loader from 'module/ui/loader';

export const Album = (React as any).createClass({
	mixins: [Morearty.Mixin],

	componentWillMount: function () {
		const   schoolId = this.props.activeSchoolId,
				binding = this.getDefaultBinding();

		(window as any).Server.school.get(schoolId).then(school => {
			if(school.defaultAlbumId)
				return (window as any).Server.schoolAlbum.get({schoolId, albumId:school.defaultAlbumId});
			else{
				console.error('school.defaultAlbumId is undefined');
				return null;
			}
		}).then(album => {
			binding.set('defaultAlbum', Immutable.fromJS(album));

			return this.props.service.photos.get(album.id,{filter:{limit: 100}})
		})
		.then((photo) =>{
			binding
				.atomically()
				.set('photos', Immutable.fromJS(photo))
				.set('sync', true)
				.commit();

		});
	},
	render: function() {
		const binding = this.getDefaultBinding();

		if (binding.get('sync')) {
			return (
				<div>
					<div className="eSchoolMaster_wrap">
						<h1 className="eSchoolMaster_title">Gallery <span>{binding.toJS('photos').length}</span></h1>
						<div className="eSchoolMaster_button">
							<button className="bButton" onClick={() => window.location.href = `/#${this.props.basePath}/view/${binding.toJS('defaultAlbum').id}/add`}>Add photo</button>
						</div>
					</div>
					<div className="bAlbum">
						<SchoolGallery binding={binding} service={this.props.service}/>
					</div>
				</div>
			);
		} else {
			return (
				<Loader/>
			);
		}
	}
});
