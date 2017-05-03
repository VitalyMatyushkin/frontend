/**
 * Created by bridark on 04/06/15.
 */
const   RouterView 				= require('module/core/router'),
		Route 					= require('module/core/route'),
		LoginRoute 				= require('module/core/routes/login_route'),
		LogoutRoute 			= require('module/core/routes/logout_route'),
		RegisterRoute 			= require('module/core/routes/register_route'),
		SettingsRoute 			= require('module/core/routes/settings_route'),
		Morearty 				= require('morearty'),
		React 					= require('react'),
		SchoolPageComponent 	= require('module/as_school/pages/school/school_page'),
		FixturePageComponent 	= require("module/as_school/pages/fixtures/fixtures_page"),
		CalendarPageComponent 	= require('module/as_school/pages/calendar/calendar_page'),
		OpponentsPageComponent 	= require('module/as_school/pages/opponents/opponents_page'),
		SchoolAddComponent		= require('module/as_manager/pages/schools/schools_add'),
		AlbumsComponent			= require('module/ui/gallery/albums'),
		AdminDashboardComponent	= require('module/as_admin/pages/admin_schools/admin_dashboard'),
		SchoolSandboxComponent	= require('module/as_admin/pages/admin_schools/school_sandbox/sandbox'),
		NotificationAlert		= require('./../ui/notification_alert/notification_alert'),
		ConfirmAlert			= require('./../ui/confirm_alert/confirm_alert'),
		AdminUserNotification 	= require('module/as_admin/pages/admin_user/admin_user_notification'),
		AdminUserPageComponent 	= require('module/as_admin/pages/admin_user/admin_user_page_component');

const Center = React.createClass({
	mixins: [Morearty.Mixin],
	getMergeStrategy: function () {
		return Morearty.MergeStrategy.MERGE_REPLACE;
	},
	render: function() {
		const 	self 			= this,
				binding 		= self.getDefaultBinding(),
				currentPage 	= binding.get('routing.currentPageName') || '',
				mainClass 		= 'bMainLayout mClearFix m' + currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

		return (
			<div className={mainClass}>
				<div className="bPageWrap">
					<RouterView routes={ binding.sub('routing') } binding={binding}>
						<Route
							path 		= "/ /school /school/:subPage"
							binding 	= { binding.sub('schoolProfile') }
							component 	= { SchoolPageComponent }
						/>
						<Route
							path 		= "/fixtures"
							binding 	= { binding.sub('schoolFixtures') }
							component 	= { FixturePageComponent }
						/>
						<Route
							path 		= "/calendar"
							binding 	= { binding.sub('schoolCalendar') }
							component 	= { CalendarPageComponent }
						/>
						<Route
							path 		= "/opponents/:subPage"
							binding 	= { binding.sub('opponentsList') }
							component 	= { OpponentsPageComponent }
						/>
						<Route
							path 		= "/schools/add "
							binding 	= { binding.sub('schoolsPage') }
							component 	= { SchoolAddComponent }
						/>
						<Route
							path 		= "/albums /albums/:albumId"
							binding 	= { binding.sub('albums') }
							component 	= { AlbumsComponent }
						/>
						<Route
							path		= "/admin_schools /admin_schools/:subPage /admin_schools/:subFolder/:subPage /admin_schools/:subFolder/:subPage/:mode"
							binding		= { binding.sub('adminDashboard') }
							component	= { AdminDashboardComponent }
						/>
						<Route
							path		= "/user/view /user/notification-view"
							binding		= { binding.sub('adminUserPage') }
							component	= { AdminUserPageComponent }
						/>
						<Route
							path 		="/school_sandbox/:schoolId school_sandbox/:schoolId/:subPage /school_sandbox/:schoolId/:subPage/:mode /school_sandbox/:schoolId/:subPage/:mode/:id"
							binding 	={ binding.sub('schoolSandbox') }
							component 	={ SchoolSandboxComponent }
						/>
						<LoginRoute
							binding = { binding.sub('userData') }
						/>
						<LogoutRoute
							binding = { binding.sub('userData') }
						/>
						<SettingsRoute
							binding = { binding.sub('userData') }
						/>
						<RegisterRoute
							binding = { binding.sub('form.register') }
						/>
					</RouterView>
					<NotificationAlert
						binding = { binding.sub('notificationAlertData')}
					/>
					<ConfirmAlert
						binding = { binding.sub('confirmAlertData')}
					/>
				</div>
			</div>
		)
	}
});


module.exports = Center;
