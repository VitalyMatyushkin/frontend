var RouterView = require('module/core/router'),
Route = require('module/core/route'),
If = require('module/ui/if/if'),
SubMenu = require('module/ui/menu/sub_menu'),
PhotoList = require('./photo_list'),
FullScreenList = require('./album_fullscreen_list'),
FileUpload = require('module/ui/file_upload/file_upload');
var AlbumView = React.createClass({
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
			currentPhotoId: null
		});
	},
	componentWillMount: function() {
		var self = this,
			rootBinding = self.getMoreartyContext().getBinding(),
			albumId = rootBinding.get('routing.pathParameters.1'),
			binding = self.getDefaultBinding(),
			userId = rootBinding.get('userData.authorizationInfo.userId');

		self.albumId = albumId;

		Server.albumsFindOne.get({
			filter: {
				where: {
					id: albumId
				},
				include: {
					relation: 'photos',
					scope: {
						order: 'meta.created DESC'
					}
				}
			}
		})
		.then(function(res) {
			res.currentPhotoId = res.photos.length > 0 ? res.photos[0].id : null;
			var isOwner = (userId == res.ownerId);

			self.menuItems = [{
				key: 'goback',
				name: '← GO BACK',
				href: '#'
			}];

			if (isOwner) {
				self.menuItems.push({
					key: 'file',
					name: 'Add Photo',
					href: '#',
					onChange: self.handleFile
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

	handleFile: function(e) {
		var file = e.target.files[0];
		this.uploadPhoto(file);
	},

	uploadPhoto: function(file) {
		var self = this,
		binding = self.getDefaultBinding(),
		formData = new FormData(),
		uri = window.apiBase + '/storage/' + binding.get('album.storageId'),
		fileName = Math.random().toString(12).substring(7) + '.' + file.name.split('.')[1];
		formData.append('file', file, fileName);
		var uploader = new FileUpload(uri); //Instantiate new file upload service
		self.startUploading();
		uploader.post(formData)
				.then(function(data){
							var model = {
								name: data.name,
								albumId: binding.get('album.id'),
								description: data.name,
								authorId: binding.get('album.ownerId'),
								pic: uri + '/files/' + data.name
							};
					Server.photos.post(binding.get('album.id'), model).then(function(res) {
						self.stopUploading();
						binding.sub('album.photos').update(function(photos) {
							return photos.unshift(Immutable.fromJS(res));
						});
					});
				})
				.catch(function(data){
					window.alert(data+' Please try again!');
					self.stopUploading();
				});
	},
    startUploading:function(){
        var self = this,
            binding = self.getDefaultBinding();

        binding
            .atomically()
            .set('isUploading', true)
            .commit();
    },

    stopUploading:function(){
        var self = this,
            binding = self.getDefaultBinding();

        binding
            .atomically()
            .set('isUploading', false)
            .commit();
    },

	onPhotoClick: function(photo) {
		var fullScreen = this.state.fullScreen;
		var id = photo.get('id');
		this.setState({lastClickedId: id});
		if (!fullScreen) {
			this.setState({fullScreen: true});
		}
	},

	getInitialState: function() {
		return {
			fullScreen: false,
			lastClickedId: 0
		};
	},

	onCloseFullscreen: function() {
		this.setState({fullScreen: false});
	},

	render: function() {
		var self = this,
		binding = self.getDefaultBinding();

		return (
			<div>
				<div>
				<SubMenu binding={{ default: binding.sub('albumsRouting'), itemsBinding: binding.sub('albumSubMenu') }} />
					<If condition={binding.get('sync')}>
						<div className="bAlbum">
							<h1 className="eAlbum_title">{binding.get('album.name')}</h1>
							<PhotoList binding={{default: binding.sub('album'), isUploading: binding.sub('isUploading')}}
									   onPhotoClick={self.onPhotoClick}
							/>
						</div>
					</If>
					<If condition={!binding.get('sync')}>
						<span>loading...</span>
					</If>
					<If condition={this.state.fullScreen}>
						<FullScreenList onClose={self.onCloseFullscreen} photos={binding.toJS('album.photos')} startPhoto={this.state.lastClickedId} />
					</If>
				</div>
			</div>
		);
	}
});


module.exports = AlbumView;
