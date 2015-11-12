var RouterView = require('module/core/router'),
Route = require('module/core/route'),
If = require('module/ui/if/if'),
SubMenu = require('module/ui/menu/sub_menu'),
PhotoList = require('./photo_list'),
FullScreenList = require('./album_fullscreen_list');

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
			currentPhotoId: null
		});
	},
	componentWillMount: function() {
		var self = this,rootBinding = self.getMoreartyContext().getBinding(),

		albumId = rootBinding.get('routing.pathParameters.1'),
		binding = self.getDefaultBinding(),
		rootBinding = self.getMoreartyContext().getBinding(),
		userId = rootBinding.get('userData.authorizationInfo.userId'),
		isOwner = (userId !== binding.get('album.ownerId'));

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

			binding
				.atomically()
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

		$.ajax({
			url: uri + '/upload',
			type: 'POST',
			success: function(res) {
				var uploadedFile = res.result.files.file[0],
				model = {
					name: uploadedFile.name,
					albumId: binding.get('album.id'),
					description: uploadedFile.name,
					authorId: binding.get('album.ownerId'),
					pic: uri + '/files/' + uploadedFile.name
				};

				Server.photos.post(binding.get('album.id'), model).then(function(res) {
					binding.sub('album.photos').update(function(photos) {
						return photos.unshift(Immutable.fromJS(res));
					});
				});
			},
			data: formData,
			cache: false,
			contentType: false,
			processData: false
		});
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
				<SubMenu binding={binding.sub('albumsRouting')} items={self.menuItems} />
					<If condition={binding.get('sync')}>
						<div className="bAlbum">
							<h1 className="eAlbum_title">{binding.get('album.name')}</h1>
							<PhotoList binding={binding.sub('album')} onPhotoClick={self.onPhotoClick} />
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