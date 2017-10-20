const	React								= require('react'),
		Morearty							= require('morearty'),
		RouterView							= require('module/core/router'),
		Route								= require('module/core/route'),
		LogoutRoute							= require('module/core/routes/logout_route'),
		SettingsRoute						= require('module/core/routes/settings_route'),
		EventComponent						= require('module/as_manager/pages/event/event_page'),
		SchoolUnionAdminComponent			= require('../pages/school_unions_pages/school_union_admin/school_union_admin'),
		SchoolUnionEventsComponent			= require('module/as_manager/pages/school_unions_pages/school_union_events/school_union_events'),
		SchoolUnionConsoleComponent			= require('../pages/school_unions_pages/school_union_console/school_union_console'),
		SchoolUnionGalleryRoutesComponent	= require('../pages/school_unions_pages/school_union_admin/pages/school_union_gallery/schoolUnionGalleryRoutes'),
		InvitesComponent					= require('module/as_manager/pages/invites/invites');

const EventFormConsts = require('module/as_manager/pages/events/manager/event_form/consts/consts');

const MoreartyHelper = require('module/helpers/morearty_helper');

const SchoolUnionsRouter = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.activeSchoolId = MoreartyHelper.getActiveSchoolId(this);
	},
	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<RouterView
				routes	= {binding.sub('routing')}
				binding	= {binding}
			>
				<LogoutRoute	binding	= {binding.sub('userData')}/>

				<SettingsRoute	binding	= {binding.sub('userData')} />

				<Route	path		= "/school_union_admin/:subPage /school_union_admin/:subPage/:mode"
						binding		= {binding.sub('activeSchool')}
						component	= {SchoolUnionAdminComponent}
				/>

				<Route	path			= "/events /events/:subPage"
						binding			= { binding.sub('events') }
						component		= { SchoolUnionEventsComponent }
						activeSchoolId	= { this.activeSchoolId }
				/>

				<Route	path					= "/event /event/:eventId /event/:eventId/:mode"
						binding					= { binding.sub('schoolUnionEventPage') }
						component				= { EventComponent }
						mode					= { EventFormConsts.EVENT_FORM_MODE.SCHOOL_UNION }
						isShowControlButtons	= { false }
				/>

				<Route	path		= "/invites /invites/:filter /invites/:inviteId/:mode"
						binding		= { binding.sub('invites') }
						component	= { InvitesComponent }
						schoolType	= { EventFormConsts.EVENT_FORM_MODE.SCHOOL_UNION }
				/>

				<Route	path		= "/school_union_console /school_union_console/:filter /school_union_console/:inviteId/:mode"
						binding		= {binding.sub('permissions')}
						component	= {SchoolUnionConsoleComponent}
				/>

				<Route	path		= "/school-union-albums /school-union-albums/:mode/:albumId /school-union-albums/:albumId/:mode/:photoId"
						binding		= {binding.sub('school-union-albums')}
						component	= {SchoolUnionGalleryRoutesComponent}
				/>
			</RouterView>
		);
	}
});

module.exports = SchoolUnionsRouter;