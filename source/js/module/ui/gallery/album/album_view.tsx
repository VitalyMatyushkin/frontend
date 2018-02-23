import {If} from 'module/ui/if/if';
import * as React from 'react';
import * as Immutable from 'immutable';
import * as SessionHelper from 'module/helpers/session_helper';
import * as Morearty from 'morearty';
import {SubMenu} from 'module/ui/menu/sub_menu';
import {SchoolGallery} from './school_gallery';
import * as Loader from 'module/ui/loader';

export const AlbumViewComponent = (React as any).createClass({
	mixins: [Morearty.Mixin],
	
	getMergeStrategy: function() {
		return Morearty.MergeStrategy.MERGE_REPLACE;
	},

	componentWillMount: function() {
		const 	rootBinding = this.getMoreartyContext().getBinding(),
				binding 	= this.getDefaultBinding(),
				params 		= rootBinding.toJS('routing.pathParameters'),
				albumId 	= params && params.length ? params[params.length-1] : null,
				userId 		= SessionHelper.getUserIdFromSession(
					rootBinding.sub('userData')
				);

		binding.set('sync', false);
		this.albumId = albumId;
		this.props.service.album.get(albumId)
		.then((res) => {
			const isOwner = (userId == res.ownerId);
			
			this.menuItems = [{
				key: 'goback',
				name: '← Go back'
			}];

			 // not checking owning for a while. Any permitted user should be able to upload photo into
			 // school public album.
			 // this will also show 'Add Photo' button on every album. This is bad, but not as bad as school admin
			 // who can't upload photo to album
			//if (isOwner) {
				this.menuItems.push({
					href: `/#${binding.get('basePath')}/view/${albumId}/add`,
					name: 'Add photo',
					key: 'addPhoto'
				});
			//}

			binding
				.atomically()
				.set('albumSubMenu', Immutable.fromJS(this.menuItems))
				.set('album', Immutable.fromJS(res))
				.commit();

			return this.props.service.photos.get(albumId,{filter:{limit: 100}})
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
		const   binding = this.getDefaultBinding();

		return (
			<div>
				<SubMenu binding={{ default: binding.sub('albumsRouting'), itemsBinding: binding.sub('albumSubMenu') }} />
					<If condition={binding.get('sync')}>
						<div>
							<div className="eSchoolMaster_wrap">
								<h1 className="eSchoolMaster_title">Gallery</h1>
								<div className="eStrip"></div>
							</div>
						<div className="bAlbum">
							<h2 className="eAlbum_title">{binding.get('album.name')}</h2>
							<SchoolGallery service={this.props.service} binding={binding} albumId={this.albumId}/>
						</div>
						</div>
					</If>
					<If condition={!binding.get('sync')}>
						<Loader/>
					</If>
			</div>
		);
	}
});
