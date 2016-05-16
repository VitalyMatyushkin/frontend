const 	React 			= require('react'),
		noImage			= '/images/no-image.jpg',
		SVG 			= require('module/ui/svg');

const AlbumItem = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
        basePath:React.PropTypes.string.isRequired,
        onDelete:React.PropTypes.func
	},
    getDefaultProps: function() {
        return {
            basePath:'notFound'
        };
    },

    componentWillMount: function () {
    },
	onClickAlbum: function(e) {
		const 	self 		= this,
				binding 	= self.getDefaultBinding(),
                album 		= binding.toJS();

        document.location.hash = self.props.basePath + '/view/' + album.id;

		e.stopPropagation();
	},
	onClickEditAlbum: function(e) {
		const self = this,
			binding = self.getDefaultBinding(),
            album = binding.toJS();

        document.location.hash = self.props.basePath + '/edit/' + album.id;

		e.stopPropagation();
	},
	onClickDeleteAlbum: function(e) {
		const self = this,
			binding = self.getDefaultBinding(),
            album = binding.toJS();

		self.props.onDelete && confirm("Delete this album?") && self.props.onDelete(album);

		e.stopPropagation();
	},
	render: function() {
		const 	self 	= this,
				binding = self.getDefaultBinding(),
				a 		= binding.toJS(),
				name 	= a ? a.name : '',
				cover 	= a && a.coverUrl ? window.Server.images.getResizedToBoxUrl(a.coverUrl, 200, 200) : noImage,
				styles 	= { backgroundImage: 'url(' + cover + ')'};

		return (
				<div onClick={self.onClickAlbum} className='eAlbum' style={styles}>
					<div className="eAlbumActions">
						<span><SVG icon="icon_photo"/></span>
						<span><SVG icon="icon_comments"/></span>
						<span ></span>
						<span onClick={self.onClickEditAlbum}><SVG icon="icon_edit"/></span>
						<span onClick={self.onClickDeleteAlbum}><SVG classes="ePhotoDelete" icon="icon_delete"/></span>
					</div>
					<div className="eAlbumInfo">
						<span className='eAlbumTitle'>{name}</span>
					</div>
				</div>
		);
	}
});


module.exports = AlbumItem;
