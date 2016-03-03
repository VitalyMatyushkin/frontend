const 	If 				= require('module/ui/if/if'),
		SubMenu 		= require('module/ui/menu/sub_menu'),
		PhotoList 		= require('../photo/photo_list'),
		FullScreenList 	= require('../photo/fullscreen_list'),
		Gallery 		= require('../galleryServices'),
		React			= require('react'),
		Immutable		= require('immutable');

const AlbumView = React.createClass({
	mixins: [Morearty.Mixin],
	displayName: 'AlbumPage',
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
				albumId 		= rootBinding.get('routing.pathParameters.1'),
				binding 		= self.getDefaultBinding(),
				userId 			= rootBinding.get('userData.authorizationInfo.userId');

		self.gallery = new Gallery(binding.sub('album'));

		self.gallery.loadAlbumWithPhotos(albumId)
		.then(function(res) {
			const isOwner = (userId == res.ownerId);

			self.menuItems = [{
				key: 'goback',
				name: '← GO BACK',
				href: '#'
			}];

			if (isOwner) {
				self.menuItems.push({
					key: 		'file',
					name: 		'Add Photo',
					href: 		'#',
					onChange: 	self.handleFile
				});
			}

			binding
				.atomically()
				.set('albumSubMenu', Immutable.fromJS(self.menuItems))
				.set('album', Immutable.fromJS(res))
				.set('sync', true)
				.commit();
		});
	},

	/** Will trigger on submenu 'Add Photo' click */
	handleFile: function(e) {
		const 	file 		= e.target.files[0],
				isUploading = this.getDefaultBinding().sub('isUploading');

		this.gallery.uploadPhoto(file, isUploading);
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
									   onPhotoClick={self.onPhotoClick}
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
