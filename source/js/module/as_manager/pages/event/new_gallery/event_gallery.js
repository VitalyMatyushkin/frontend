const	React 				= require('react'),
		Morearty			= require('morearty'),
		Actions				= require('./event_gallery_actions'),
		Gallery				= require('./../../../../ui/new_gallery/galley'),
		RoleHelper			= require('./../../../../helpers/role_helper');

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
				eventId		= this.props.eventId,
				userRole	= RoleHelper.getLoggedInUserRole(this);

		return (
			<div className='bEvent_media bEventBottomContainer'>
				<Gallery	isPublic					= { false }
							handleChangeAddPhotoButton	= { file => Actions.addPhotoToEvent(userRole, binding, schoolId, eventId, file) }
							handleClickDeletePhoto		= { photoId => Actions.deletePhotoFromEvent(userRole, binding, schoolId, eventId, photoId) }
							handleChangeAccessPreset	= { (photoId, preset) => Actions.changePhotoPreset(userRole, binding, schoolId, eventId, photoId, preset) }
							photos						= { photos }
							isLoading					= { isLoading }
				/>
			</div>
		);
	}
});


module.exports = EventGallery;
