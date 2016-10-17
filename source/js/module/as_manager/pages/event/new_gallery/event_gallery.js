const	React 				= require('react'),
		Morearty			= require('morearty'),
		Actions				= require('./event_gallery_actions'),
		Gallery				= require('./../../../../ui/new_gallery/galley');

const EventGallery = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId:	React.PropTypes.string.isRequired,
		eventId:		React.PropTypes.string.isRequired
	},

	render: function() {
		const	binding		= this.getDefaultBinding(),
				photos		= binding.toJS('photos'),
				isLoading	= !binding.toJS('isSync'),
				schoolId	= this.props.activeSchoolId,
				eventId		= this.props.eventId;

		return (
			<div className='bEvent_media bEventBottomContainer'>
				<Gallery	isPublic					= { false }
							handleChangeAddPhotoButton	= { file => Actions.addPhotoToEvent(binding, schoolId, eventId, file) }
							handleClickDeletePhoto		= { photoId => Actions.deletePhotoFromEvent(binding, schoolId, eventId, photoId) }
							photos						= { photos }
							isLoading					= { isLoading }
				/>
			</div>
		);
	}
});


module.exports = EventGallery;
