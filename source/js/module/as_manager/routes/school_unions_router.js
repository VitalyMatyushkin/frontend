const	React								= require('react'),
		Morearty							= require('morearty'),
		RouterView							= require('module/core/router'),
		Route								= require('module/core/route'),
		LogoutRoute							= require('module/core/routes/logout_route'),
		SettingsRoute						= require('module/core/routes/settings_route'),
		SchoolUnionAdminComponent			= require('../pages/school_unions_pages/school_union_admin/school_union_admin'),
		SchoolUnionConsoleComponent			= require('../pages/school_unions_pages/school_union_console/school_union_console'),
		SchoolUnionGalleryRoutesComponent	= require('../pages/school_unions_pages/school_union_admin/pages/school_union_gallery/schoolUnionGalleryRoutes');

const SchoolUnionsRouter = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<RouterView	routes	= {binding.sub('routing')}
						binding	= {binding}
			>
				<LogoutRoute	binding	= {binding.sub('userData')}/>
				<SettingsRoute	binding	= {binding.sub('userData')} />
				<Route	path		= "/school_union_admin/:subPage /school_union_admin/:subPage/:mode"
						binding		= {binding.sub('activeSchool')}
						component	= {SchoolUnionAdminComponent}
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