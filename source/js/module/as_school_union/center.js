const	Morearty				= require('morearty'),
		React					= require('react'),
		RouterView				= require('module/core/router'),
		Route					= require('module/core/route'),
		PublicSchoolUnionPage	= require("./pages/school_home/home"),
		EventPageComponent		= require("./pages/event/public_event_page"),
		LoginPublicSchoolPage	= require("./../as_school/pages/school_home/login_public_school_page"),
		Page404					= require("./../ui/404_page"),
		NotificationAlert		= require('./../ui/notification_alert/notification_alert'),
		ConfirmAlert			= require('./../ui/confirm_alert/confirm_alert');

const Center = React.createClass({
	mixins: [Morearty.Mixin],
	getMergeStrategy: function () {
		return Morearty.MergeStrategy.MERGE_REPLACE;
	},
	render: function() {
		const	binding		= this.getDefaultBinding(),
				currentPage	= binding.get('routing.currentPageName') || '',
				mainClass	= 'bMainLayout mClearFix m' + currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

		return (
			<div className={mainClass}>
				<div className="bPageWrap">
					<RouterView routes={binding.sub('routing')} binding={binding}>
						<Route	path		= "/ /home /fixtures /calendar /news /results /schools /league"
								binding		= {binding.sub('schoolHomePage')}
								component	= {PublicSchoolUnionPage}
						/>

						<Route	path		= "/event /event/:eventId /event/:eventId/:mode"
								binding		= {binding.sub('schoolEvent')}
								component	= {EventPageComponent}
						/>

						<Route path			= "/ /loginPublicSchool"
							   binding		= {binding.sub('loginPublicSchool')}
							   component	= {LoginPublicSchoolPage}/>

						<Route path			= "/ /404"
							   binding		= { binding }
							   component	= { Page404 }/>
					</RouterView>
				</div>
				<NotificationAlert binding={binding.sub('notificationAlertData')} />
				<ConfirmAlert binding={binding.sub('confirmAlertData')} />
			</div>
		)
	}
});

module.exports = Center;