/**
 * Created by Woland on 23.08.2017.
 */
const 	React 		= require('react'),
		Morearty 	= require('morearty'),
		Immutable 	= require('immutable');

const NotificationsForm = require('./notifications_form');

const NotificationsPage = React.createClass({
	mixins: [Morearty.Mixin],
	onSubmit: function(data){
		const 	binding 	= this.getDefaultBinding(),
				schoolId 	= binding.get('schoolSandboxRouting.routing.pathParameters.0');

		const patchedData = { ...data };
		Object.keys(patchedData).forEach( key => {
			const value = patchedData[key];
			switch (value) {
				case true:	patchedData[key] = 'AUTO'; break;
				case false:	patchedData[key] = 'DISABLED'; break;
			}
		});

		window.Server.schoolNotifications.put({ schoolId }, patchedData ).then( response => {
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
				schoolId 				= binding.get('schoolSandboxRouting.routing.pathParameters.0');

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