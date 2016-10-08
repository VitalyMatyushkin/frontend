const	React 				= require('react'),
		Morearty			= require('morearty'),
		Immutable 			= require('immutable'),

		Gallery				= require('./../../../../ui/new_gallery/galley');

const EventGallery = React.createClass({
	mixins: [Morearty.Mixin],

	handleClickAddPhotoButton: function(id) {

	},

	render: function() {
		const photos = this.getDefaultBinding().toJS('photos');

		return (
			<div className='bEvent_media bEventBottomContainer'>
				<Gallery	photos						= { photos }
							handleClickAddPhotoButton	= { this.handleClickAddPhotoButton }
				/>
			</div>
		);
	}
});


module.exports = EventGallery;
