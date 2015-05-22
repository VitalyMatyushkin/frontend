var If = require('module/ui/if/if'),
	PhotoList;

PhotoList = React.createClass({
	mixins: [Morearty.Mixin],
	renderPhoto: function(photo, index) {
		var self = this,
			binding = self.getDefaultBinding(),
			currentPhotoId = binding.get('currentPhotoId'),
			classes = classNames({
				mActive: currentPhotoId === photo.get('id'),
				'eAlbums_photo': true
			}),
			styles = {backgroundImage: 'url(' + photo.get('pic') + ')'};

		return <div onClick={self.onClickPhoto.bind(null, photo)} key={'photo-' + index} className={classes} style={styles}></div>;
	},
	onClickPhoto: function(photo) {
		var self = this,
			binding = self.getDefaultBinding();

		binding.set('currentPhotoId', photo.get('id'));
	},
	handleFile: function(e) {
		var self = this,
			binding = self.getDefaultBinding(),
			file = e.target.files[0],
			formData = new FormData(),
			fileName = Math.random().toString(36).substring(7) + file.name;

		formData.append('file', file, fileName);

		$.ajax({
			url: '//api.squadintouch.com/v1/storage/' + binding.get('album.storageId') + '/upload',
			type: 'POST',
			success: function() {
				console.log(arguments)
			},
			// Form data
			data: formData,
			//Options to tell jQuery not to process data or worry about content-type.
			cache: false,
			contentType: false,
			processData: false
		});
	},
	render: function() {
        var self = this,
			binding = self.getDefaultBinding(),
			styles = {display: 'none'},
			rootBinding = self.getMoreartyContext().getBinding(),
			userId = rootBinding.get('userData.authorizationInfo.userId'),
			isOwner = userId !== binding.get('album.ownerId');

		return <div className="bAlbums_list">
			<If condition={isOwner}>
				<div className="eAlbums_photo mUpload">+<input onChange={this.handleFile} type="file" className="eAlbums_input" /></div>
			</If>
			{binding.get('album.photos').map(self.renderPhoto.bind(self))}
		</div>;
	}
});


module.exports = PhotoList;
