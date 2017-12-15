
import * as React from 'react';
import * as Immutable from 'immutable';
import * as SessionHelper from 'module/helpers/session_helper';
import * as Morearty from 'morearty';
import {FullScreenList} from '../photo/fullscreen_list';
import {PhotoList} from '../photo/photo_list';
import {SubMenu} from 'module/ui/menu/sub_menu';
import {If} from 'module/ui/if/if';

export const AlbumViewComponent = (React as any).createClass({
	mixins: [Morearty.Mixin],
	
	getMergeStrategy: function() {
		return Morearty.MergeStrategy.MERGE_REPLACE;
	},
	
	getDefaultState: function() {
		return Immutable.fromJS({
			album: {
				photos: []
			},
			sync: false,
            isUploading:false,
			fullScreen: false
		});
	},
	
	componentWillMount: function() {
		const 	rootBinding = this.getMoreartyContext().getBinding(),
				binding 	= this.getDefaultBinding(),
				params 		= rootBinding.toJS('routing.pathParameters'),
				albumId 	= params && params.length ? params[params.length-1] : null,
				userId 		= SessionHelper.getUserIdFromSession(
					rootBinding.sub('userData')
				);
		
		// this.service = this.props.service;
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
				.set('sync', true)
				.commit();
		});
	},

	onPhotoClick: function(photo): void {
		const 	binding 	= this.getDefaultBinding(),
				fullScreen 	= binding.get('fullScreen'),
				id 			= photo.id;
		
		this.setState({lastClickedId: id});
		if (!fullScreen) {
			binding.set('fullScreen', true);
		}
	},

	getInitialState: function() {
		return {
			lastClickedId: 0
		};
	},

	onCloseFullScreen: function(): void {
		this.getDefaultBinding().set('fullScreen', false);
	},

	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<div>
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
							<PhotoList
								binding		={{default: binding.sub('album'), isUploading: binding.sub('isUploading')}}
								onPhotoClick={this.onPhotoClick}
								service		={this.service}
							/>
						</div>
						</div>
					</If>
					<If condition={!binding.get('sync')}>
						<span>loading...</span>
					</If>
					<If condition={binding.get('fullScreen')}>
						<FullScreenList
							onClose		= {this.onCloseFullScreen}
							photos		= {binding.toJS('album.photos')}
							startPhoto	= {this.state.lastClickedId}
						/>
					</If>
				</div>
			</div>
		);
	}
});
