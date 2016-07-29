const 	RouterView 					= require('module/core/router'),
		Route 						= require('module/core/route'),
		LoginRoute 					= require('module/core/routes/login_route'),
		LogoutRoute 				= require('module/core/routes/logout_route'),
		RegisterRoute 				= require('module/core/routes/register_route'),
		VerifyRoute 				= require('module/core/routes/verify_route'),
		SettingsRoute 				= require('module/core/routes/settings_route'),
		Morearty        			= require('morearty'),
		React 						= require('react'),
		StudentPageComponent 		= require("module/as_manager/pages/student/student_page"),
		EventsComponent 			= require("module/as_parents/pages/events/events"),
		EventComponent 				= require("module/as_manager/pages/event/event"),
		GalleryRoutesComponent 		= require("module/as_manager/pages/event/gallery/eventGalleryRoutes");



const Center = React.createClass({
	mixins: [Morearty.Mixin],
	getMergeStrategy: function() {
		return Morearty.MergeStrategy.MERGE_REPLACE;
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			currentPage = binding.get('routing.currentPageName') || '',
			mainClass = 'bMainLayout mClearFix m' + currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

		return (
			<div className={mainClass}>
				<div className="bPageWrap">

					<RouterView routes={ binding.sub('routing') } binding={binding}>

						<RegisterRoute binding={binding.sub('form.register')}  />
						<LoginRoute binding={binding.sub('userData')}  />
						<LogoutRoute binding={binding.sub('userData')}  />
						<VerifyRoute binding={binding.sub('userData')} />
						<SettingsRoute binding={binding.sub('userData')} />


						<Route path="/student"
							   binding={binding.sub('events')}
							   component={StudentPageComponent}/>

						<Route path="/events/calendar/:userId /events/fixtures/:userId /events/achievement/:userId"
							   binding={binding.sub('events')}
							   component={EventsComponent}/>

						<Route path="/event /event/:eventId /event/:eventId/:mode"
							   binding={binding.sub('events')}
							   component={EventComponent}/>

						<Route path="/event-albums/:eventId/:mode /event-albums/:eventId/:mode/:albumId /event-albums/:eventId/:albumId/:mode/:photoId"
							   binding={binding.sub('event-albums')}
							   component={GalleryRoutesComponent}/>

					</RouterView>

				</div>
			</div>
		)
	}
});

module.exports = Center;
