const 	React 			= require('react'),
		noImage			= '/images/no-image.jpg',
		SVG 				= require('module/ui/svg');

const AlbumItem = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onView: React.PropTypes.func.isRequired,
		onEdit: React.PropTypes.func,
		onDelete: React.PropTypes.func
	},

	onClickAlbum: function(e) {
		const 	self 		= this,
				binding 	= self.getDefaultBinding(),
				a 			= binding.toJS();

		self.props.onView && self.props.onView(a);

		e.stopPropagation();
	},
	onClickEditAlbum: function(e) {
		const self = this,
			binding = self.getDefaultBinding(),
			a = binding.toJS();

		self.props.onEdit && self.props.onEdit(a);

		e.stopPropagation();
	},
	onClickDeleteAlbum: function(e) {
		const self = this,
			binding = self.getDefaultBinding(),
			a = binding.toJS();

		self.props.onDelete && confirm("Delete this album?") && self.props.onDelete(a);

		e.stopPropagation();
	},
	componentDidMount: function () {
	},
	render: function() {
		const 	self 	= this,
				binding = self.getDefaultBinding(),
				a 		= binding.toJS(),
				name 	= a ? a.name : '',
				cover 	= a && a.coverUrl ? window.Server.images.getResizedToBoxUrl(a.coverUrl, 200, 200) : noImage,
				styles 	= { backgroundImage: 'url(' + cover + ')'};

		return (
				<div onClick={self.onClickAlbum} className='eEventAlbums_album' style={styles}>
					<div className="eAlbumActions">
						<span><SVG icon="icon_photo"/></span>
						<span><SVG icon="icon_comments"/></span>
						<span ></span>
						<span onClick={self.onClickEditAlbum}><SVG icon="icon_edit"/></span>
						<span onClick={self.onClickDeleteAlbum}><SVG classes="ePhotoDelete" icon="icon_delete"/></span>
					</div>
					<div className="eAlbumInfo">
						<span className='eEventAlbums_albumTitle'>{name}</span>
					</div>
				</div>
		);
	}
});


module.exports = AlbumItem;
