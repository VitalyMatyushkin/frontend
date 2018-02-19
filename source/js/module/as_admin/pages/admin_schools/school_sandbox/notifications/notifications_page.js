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
		const binding = this.getDefaultBinding();
		const schoolId = binding.get('schoolSandboxRouting.routing.pathParameters.0');

		const patchedData = { ...data };
		Object.keys(patchedData).forEach( key => {
			const value = patchedData[key];
			switch (value) {
				case true:	patchedData[key] = 'AUTO'; break;
				case false:	patchedData[key] = 'DISABLED'; break;
			}
		});

		window.Server.schoolNotifications.put({ schoolId }, patchedData ).then( () => {
			window.simpleAlert(
				`Notifications settings have been saved`,
				'Ok',
				() => {}
			);
		});
	},
	render: function(){
		return (
			<NotificationsForm
				binding={this.getDefaultBinding().sub('notificationsForm')}
				onSubmit={this.onSubmit}
				schoolId={this.getDefaultBinding().get('schoolSandboxRouting.routing.pathParameters.0')}
			/>
		);
	}
});

module.exports = NotificationsPage;