/**
 * Created by Woland on 16.01.2017.
 */
const	React					= require('react'),
		Morearty				= require('morearty'),

		RouterView				= require('module/core/router'),
		Route					= require('module/core/route'),
		LogoutRoute				= require('module/core/routes/logout_route'),
		SettingsRoute			= require('module/core/routes/settings_route'),
		VerifyRoute				= require('module/core/routes/verify_route'),

		EventComponent			= require('../pages/students_pages/event/event_page'),
		StudentEventsComponent	= require('./../pages/students_pages/events/events'),
		{Messages}      		= require('module/as_manager/pages/students_pages/messages/messages'),

		{ SupportedBrowsers }	= require('module/shared_pages/supported_browsers/supported_browsers');

/**
 * It's a router for user with student role.
 */
const StudentRouter = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<RouterView
				routes	= {binding.sub('routing')}
				binding	= {binding}
			>
				<LogoutRoute
					binding = {binding.sub('userData')}
				/>

				<VerifyRoute
					binding = {binding.sub('userData')}
				/>

				<SettingsRoute
					binding = {binding.sub('userData')}
				/>

				<Route
					path		= '/events/calendar/:schoolId /events/fixtures/:schoolId /events/achievement/:schoolId'
					binding		= {binding.sub('events')}
					component	= {StudentEventsComponent}
				/>

				<Route
					path		= '/event /event/:eventId'
					binding		= {binding.sub('events')}
					component	= {EventComponent}
				/>

				<Route
					path		= '/messages /messages/:subPage'
				 	binding		= { binding.sub('messages') }
					component	= { Messages }
				/>

				<Route
					path		= '/supported_browsers'
					binding		= {binding.sub('supported_browsers')}
					component	= {SupportedBrowsers}
				/>
			</RouterView>
		);
	}
});

module.exports = StudentRouter;
