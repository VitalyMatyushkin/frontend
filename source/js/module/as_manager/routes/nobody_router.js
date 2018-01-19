const	React					= require('react'),
		Morearty				= require('morearty'),
		Route					= require('module/core/route'),
		RouterView				= require('module/core/router'),
		LoginRoute				= require('module/core/routes/login_route2'),
		LogoutRoute				= require('module/core/routes/logout_route'),
		RegisterRoute			= require('module/core/routes/register_route'),
		RegisterTestRoute       = require('module/core/routes/register_test_route'),
		SettingsRoute			= require('module/core/routes/settings_route'),
		{ SupportedBrowsers }	= require('module/shared_pages/supported_browsers/supported_browsers');

/**
 * It's a router for user without role.
 */
const NobodyRouter = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<RouterView	routes	= {binding.sub('routing')}
						binding	= {binding}
			>
				<LoginRoute		binding	= {binding.sub('userData')}/>
				<LogoutRoute	binding	= {binding.sub('userData')}/>
				<RegisterRoute	binding	= {binding.sub('form.register')}/>
				<RegisterTestRoute  binding={binding.sub('form.form.registerTest')} />
				<SettingsRoute	binding	= {binding.sub('userData')}/>

				<Route
					path		= "/supported_browsers"
					binding		= {binding.sub('supported_browsers')}
					component	= {SupportedBrowsers}
				/>
			</RouterView>
		);
	}
});

module.exports = NobodyRouter;