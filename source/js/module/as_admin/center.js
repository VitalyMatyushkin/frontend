/**
 * Created by bridark on 04/06/15.
 */
const 	Morearty 				= require('morearty'),
		React 					= require('react');

const   RouterView 				= require('module/core/router'),
		Route 					= require('module/core/route'),
		LoginRoute 				= require('module/core/routes/login_route'),
		LogoutRoute 			= require('module/core/routes/logout_route'),
		RegisterRoute 			= require('module/core/routes/register_route'),
		SettingsRoute 			= require('module/core/routes/settings_route');

const 	SchoolPageComponent 	= require('module/as_school/pages/school/school_page'),
		FixturePageComponent 	= require("module/as_school/pages/fixtures/fixtures_page"),
		CalendarPageComponent 	= require('module/as_school/pages/calendar/calendar_page'),
		OpponentsPageComponent 	= require('module/as_school/pages/opponents/opponents_page'),
		SchoolAddComponent		= require('module/as_manager/pages/schools/schools_add'),
		{AlbumRoutes}			= require('module/ui/gallery/albums'),
		{ActionDescriptorRouter}= require('module/as_admin/pages/admin_schools/action_descriptors/action-descriptor-router'),
		AdminDashboardComponent	= require('module/as_admin/pages/admin_schools/admin_dashboard'),
		SchoolSandboxComponent	= require('module/as_admin/pages/admin_schools/school_sandbox/sandbox'),
		NotificationAlert		= require('./../ui/notification_alert/notification_alert'),
		ConfirmAlert			= require('./../ui/confirm_alert/confirm_alert'),
		AdminUserPageComponent 	= require('module/as_admin/pages/admin_user/admin_user_page_component'),
		ToolsComponent 			= require('module/as_admin/pages/admin_schools/tools'),
		{PaymentsComponent} 	= require('module/as_admin/pages/admin_schools/payments/payments'),
		AppsComponent 			= require('module/as_admin/pages/apps/apps'),
		UsersComponent			= require('module/as_admin/pages/admin_schools/users'),
		SchoolsComponent		= require('module/as_admin/pages/admin_schools/schools'),
		SportsComponent			= require('module/as_admin/pages/admin_schools/sports'),
		InvitesComponent		= require('module/as_admin/pages/tools/tools');

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
							component 	= { AlbumRoutes }
						/>
						<Route
							path		= "/users /users/:subPage /users/:subFolder/:subPage"
							binding		= { binding.sub('users') }
							component	= { UsersComponent }
						/>
						<Route
							path		= "/users/action_descriptor/:adId /users/action_descriptor/:adId/:subFolder /users/action_descriptor/:adId/:subFolder/:subPage"
							binding		= { binding.sub('actionDescriptorRouter') }
							component	= { ActionDescriptorRouter }
						/>
						<Route
							path		= "/schools /schools/:subPage /schools/:subFolder/:subPage /schools/:subFolder/:subPage/:mode"
							binding		= { binding.sub('schools') }
							component	= { SchoolsComponent }
						/>
						<Route
							path		= "/sports /sports/:subPage /sports/:subPage/:mode"
							binding		= { binding.sub('sports') }
							component	= { SportsComponent }
						/>
						<Route
							path		= "/user/view /user/notification-channel-view /user/notifications-view /users/notifications-view/:subPage"
							binding		= { binding.sub('adminUserPage') }
							component	= { AdminUserPageComponent }
						/>
						<Route
							path 		= "/school_sandbox/:schoolId school_sandbox/:schoolId/:subPage /school_sandbox/:schoolId/:subPage/:mode /school_sandbox/:schoolId/:subPage/:mode/:id"
							binding 	= { binding.sub('schoolSandbox') }
							component 	= { SchoolSandboxComponent }
						/>
						<Route
							path 		= "/tools /tools/:subPage"
							binding 	= { binding.sub('tools') }
							component 	= { ToolsComponent }
						/>
						<Route
							path 		= "/payments /payments/:subPage"
							binding 	= { binding.sub('payments') }
							component 	= { PaymentsComponent }
						/>
						<Route
							path 		= "/apps /apps/:subPage"
							binding 	= { binding.sub('apps') }
							component 	= { AppsComponent }
						/>
						<Route
							path 		= "/school-invite/add-invite /school-invite/list-invite"
							binding 	= { binding.sub('invites') }
							component 	= { InvitesComponent }
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
