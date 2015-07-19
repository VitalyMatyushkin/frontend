var AlbumView,
	RouterView = require('module/core/router'),
	Route = require('module/core/route'),
	If = require('module/ui/if/if'),
	SubMenu = require('module/ui/menu/sub_menu'),
	PhotoList = require('./view/photo_list');

AlbumView = React.createClass({
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
		var self = this,
			rootBinding = self.getMoreartyContext().getBinding(),
			albumId = rootBinding.get('routing.pathParameters.0'),
			binding = self.getDefaultBinding();

		self.menuItems = [{
			key: 'goback',
			name: '← GO BACK',
			href: '#'
		}];

		Server.albumsFindOne.get({
			filter: {
				where: {
					id: albumId
				},
				include: [
					{
						photos: ''
					}
				]
			}
		}).then(function(res) {
			res.currentPhotoId = res.photos.length > 0 ? res.photos[0].id : null;

			binding
				.atomically()
				.set('album', Immutable.fromJS(res))
				.set('sync', true)
				.commit();
		});
	},
	getPhoto: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			currentPhotoId = binding.get('album.currentPhotoId'),
			image = binding.get('album.photos').find(function(photo) {
				return photo.get('id') === currentPhotoId;
			});

		if (!image) {
			return null;
		} else {
			return (
				<div className="eAlbum_currentPhoto">
					<img className="eAlbum_currentImg" src={image.get('pic') + '/contain?height=800'} alt={image.get('name')} title={image.get('name')} />
				</div>
			);
		}

	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return <div>
			<SubMenu binding={binding.sub('albumsRouting')} items={self.menuItems} />
			<div>
				<If condition={binding.get('sync')}>
					<div className="bAlbum">
						<h1 className="eAlbum_title">{binding.get('album.name')}</h1>

						<PhotoList binding={binding.sub('album')}/>

							<div className="eAlbum_listContainer">
								<If condition={binding.get('album.photos').count() > 0}>
									{self.getPhoto()}
								</If>
							</div>
					</div>
				</If>
				<If condition={!binding.get('sync')}>
					<span>loading...</span>
				</If>
			</div>
		</div>;
	}
});


module.exports = AlbumView;
