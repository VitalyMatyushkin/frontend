const	React			= require('react'),
		Morearty		= require('morearty'),
		RouterView		= require('module/core/router'),
		LoginRoute		= require('module/core/routes/login_route2'),
		LogoutRoute		= require('module/core/routes/logout_route'),
		RegisterRoute	= require('module/core/routes/register_route'),
		SettingsRoute	= require('module/core/routes/settings_route');

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
				<SettingsRoute	binding	= {binding.sub('userData')}/>
			</RouterView>
		);
	}
});

module.exports = NobodyRouter;