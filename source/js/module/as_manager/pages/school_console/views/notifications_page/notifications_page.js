/**
 * Created by Woland on 23.08.2017.
 */
const 	React 		= require('react'),
		Morearty 	= require('morearty'),
		Immutable 	= require('immutable');

const SchoolHelper = require('module/helpers/school_helper');

const NotificationsForm = require('./notifications_form');

const NotificationsPage = React.createClass({
	mixins: [Morearty.Mixin],
	onSubmit: function(data){
		window.Server.schoolNotifications.put(
			SchoolHelper.getActiveSchoolId(this),
			data
		)
		.then( () => {
			window.simpleAlert(
				`Notifications settings has been saved`,
				'Ok',
				() => {}
			);
		});
	},
	render: function(){
		const 	binding 				= this.getDefaultBinding(),
				notificationBinding 	= binding.sub('notifications'),
				schoolId 				= SchoolHelper.getActiveSchoolId(this);
		
		return (
			<NotificationsForm
				binding 	= { notificationBinding }
				onSubmit 	= { this.onSubmit }
				schoolId 	= { schoolId }
			/>
		);
	}
});

module.exports = NotificationsPage;