const	React					= require('react'),
		Morearty				= require('morearty'),

		RouterView				= require('module/core/router'),
		Route					= require('module/core/route'),
		LoginRoute				= require('module/core/routes/login_route'),
		LogoutRoute				= require('module/core/routes/logout_route'),
		RegisterRoute			= require('module/core/routes/register_route'),
		SettingsRoute			= require('module/core/routes/settings_route'),
		VerifyRoute				= require('module/core/routes/verify_route'),

		EventComponent			= require('module/as_manager/pages/event/event'),
		ParentEventsComponent	= require("./../pages/parents_pages/events/events");

const ParentRouter = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<RouterView	routes	= {binding.sub('routing')}
						binding	= {binding}
			>
				<RegisterRoute	binding	= {binding.sub('form.register')}/>
				<LoginRoute		binding	= {binding.sub('userData')}/>
				<LogoutRoute	binding	= {binding.sub('userData')}/>
				<VerifyRoute	binding	= {binding.sub('userData')}/>
				<SettingsRoute	binding	= {binding.sub('userData')}/>

				<Route	path		= "/events/calendar/:userId /events/fixtures/:userId /events/achievement/:userId"
						binding		= {binding.sub('events')}
						component	= {ParentEventsComponent}
				/>
				<Route	path		= "/event /event/:eventId /event/:eventId/:mode"
						binding		= {binding.sub('events')}
						component	= {EventComponent}
				/>
			</RouterView>
		);
	}
});

module.exports = ParentRouter;
