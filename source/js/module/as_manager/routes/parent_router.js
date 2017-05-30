const	React					= require('react'),
		Morearty				= require('morearty'),

		RouterView				= require('module/core/router'),
		Route					= require('module/core/route'),
		LogoutRoute				= require('module/core/routes/logout_route'),
		SettingsRoute			= require('module/core/routes/settings_route'),
		VerifyRoute				= require('module/core/routes/verify_route'),

		EventComponent			= require('../pages/parents_pages/event/event_page'),
		ParentEventsComponent	= require('./../pages/parents_pages/events/events'),
		MessagesComponent		= require('./../pages/parents_pages/events/events');

/**
 * It's a router for user with parent role.
 */
const ParentRouter = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<RouterView	routes	= {binding.sub('routing')}
						binding	= {binding}
			>
				<LogoutRoute	binding	= {binding.sub('userData')}/>
				<VerifyRoute	binding	= {binding.sub('userData')}/>
				<SettingsRoute	binding	= {binding.sub('userData')}/>

				<Route	path		= '/events/calendar/:userId /events/fixtures/:userId /events/achievement/:userId'
						binding		= {binding.sub('events')}
						component	= {ParentEventsComponent}
				/>
				<Route	path		= '/event /event/:eventId /event/:eventId/:mode'
						binding		= {binding.sub('events')}
						component	= {EventComponent}
				/>
				<Route	path		= '/messages'
						binding		= {binding.sub('messages')}
						component	= {MessagesComponent}
				/>
			</RouterView>
		);
	}
});

module.exports = ParentRouter;