const 	If 				= require('module/ui/if/if'),
		SubMenu 		= require('module/ui/menu/sub_menu'),
		PhotoList 		= require('../photo/photo_list'),
		FullScreenList 	= require('../photo/fullscreen_list'),
		React			= require('react'),
		Morearty        = require('morearty'),
		SessionHelper	= require('module/helpers/session_helper'),
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
		const self = this;
		const rootBinding = self.getMoreartyContext().getBinding();
        const binding = self.getDefaultBinding();
		const params = rootBinding.toJS('routing.pathParameters');
		const albumId = params && params.length ? params[params.length-1] : null;
		const userId = SessionHelper.getUserIdFromSession(
			rootBinding.sub('userData')
		);

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
					href: `/#${binding.get('basePath')}/view/${albumId}/add`,
					name: 'Add photo',
					key: 'addPhoto'
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
