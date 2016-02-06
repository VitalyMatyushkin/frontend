const 	React 			= require('react'),
		noImage			= '/images/no-image.jpg';

const AlbumItem = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onView: React.PropTypes.func.isRequired,
		onEdit: React.PropTypes.func,
		onDelete: React.PropTypes.func
	},

	onClickAlbum: function(e) {
		const self = this,
			binding = self.getDefaultBinding(),
			a = binding.toJS();

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
		const self = this,
			binding = self.getDefaultBinding(),
			a = binding.toJS(),
			name = a ? a.name : '',
			cover = a && a.coverUrl ? a.coverUrl + '/contain?height=100': noImage,
			styles = {backgroundImage: 'url(' + cover + ')', width: '100px'};

		return (
			<div onClick={self.onClickAlbum} className='eEventAlbums_album' style={styles}>
				<span onClick={self.onClickEditAlbum} className='eEventAlbums_albumEdit'></span>
				<span onClick={self.onClickDeleteAlbum} className='eEventAlbums_albumDelete'></span>
				<span className='eEventAlbums_albumTitle'>{name}</span>
			</div>
		);
	}
});


module.exports = AlbumItem;
