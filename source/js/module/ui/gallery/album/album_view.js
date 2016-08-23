const 	If 				= require('module/ui/if/if'),
		SubMenu 		= require('module/ui/menu/sub_menu'),
		PhotoList 		= require('../photo/photo_list'),
		FullScreenList 	= require('../photo/fullscreen_list'),
		React			= require('react'),
		Morearty        = require('morearty'),
		Immutable		= require('immutable');

const AlbumView = React.createClass({
	mixins: [Morearty.Mixin],
    propTypes:{
        service:React.PropTypes.object
    },
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
		const 	self 			= this,
				rootBinding 	= self.getMoreartyContext().getBinding(),
                binding 		= self.getDefaultBinding(),
				params      	= rootBinding.toJS('routing.pathParameters'),
				albumId 		= params && params.length ? params[params.length-1] : null,
				userId 			= rootBinding.get('userData.authorizationInfo.userId');

		self.service = self.props.service;
		self.service.album.get(albumId)
		.then(function(res) {
			const isOwner = (userId == res.ownerId);

			self.menuItems = [{
				key: 'goback',
				name: '← Go back'
			}];

			 // not checking owning for a while. Any permitted user should be able to upload photo into
			 // school public album.
			 // this will also show 'Add Photo' button on every album. This is bad, but not as bad as school admin
			 // who can't upload photo to album
			//if (isOwner) {
				self.menuItems.push({
					key: 		'file',
					name: 		'Add Photo',
					onChange: 	self.handleFile
				});
			//}

			binding
				.atomically()
				.set('albumSubMenu', Immutable.fromJS(self.menuItems))
				.set('album', Immutable.fromJS(res))
				.set('sync', true)
				.commit();
		});
	},

	/** Will trigger on submenu 'Add Photo' click
	 * TODO: Какого хрена? этот обработчик перестает вызываться после удаления последней фотографии в альбоме
	 * как и почему это происходит - тайна покрытая мраком.
	 * Bug #1281 Add photo. http://tracker.squadintouch.com/issues/1281
	 * */
	handleFile: function(e) {
		const 	file 		= e.target.files[0],
				isUploading = this.getDefaultBinding().sub('isUploading');

		this.service.photos.upload(file, isUploading);
	},

	onPhotoClick: function(photo) {
		const 	self 		= this,
				binding 	= self.getDefaultBinding(),
				fullScreen 	= binding.get('fullScreen'),
				id 			= photo.id;

		self.setState({lastClickedId: id});
		if (!fullScreen) {
			binding.set('fullScreen', true);
		}
	},

	getInitialState: function() {
		return {
			lastClickedId: 0
		};
	},

	onCloseFullScreen: function() {
		this.getDefaultBinding().set('fullScreen', false);
	},

	render: function() {
		const 	self 	= this,
				binding = self.getDefaultBinding();

		return (
			<div>
				<div>
				<SubMenu binding={{ default: binding.sub('albumsRouting'), itemsBinding: binding.sub('albumSubMenu') }} />
					<If condition={binding.get('sync')}>
						<div>
							<div className="eSchoolMaster_wrap">
								<h1 className="eSchoolMaster_title">Gallery</h1>
								<div className="eStrip"></div>
								<h1 className="showAllPhoto">All</h1>
							</div>
						<div className="bAlbum">
							<h2 className="eAlbum_title">{binding.get('album.name')}</h2>
							<PhotoList binding={{default: binding.sub('album'), isUploading: binding.sub('isUploading')}}
									   onPhotoClick={self.onPhotoClick} service={self.service}
							/>
						</div>
						</div>
					</If>
					<If condition={!binding.get('sync')}>
						<span>loading...</span>
					</If>
					<If condition={binding.get('fullScreen')}>
						<FullScreenList onClose={self.onCloseFullScreen} photos={binding.toJS('album.photos')}
										startPhoto={this.state.lastClickedId} />
					</If>
				</div>
			</div>
		);
	}
});


module.exports = AlbumView;
