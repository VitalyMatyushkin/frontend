/**
 * Created by Woland on 02.05.2017.
 */
const React = require('react');

const AdminUserNotification = React.createClass({
	propTypes: {
		userId: React.PropTypes.string.isRequired
	},
	componentWillMount: function(){
		console.log(this.props.userId);
		window.Server.notifications.get({
			userId: this.props.userId
		}).then(
			notification => {
				console.log(notification);
				return true;
			}
		);
	},
	render: function(){
		return (
			<h1>Hello world</h1>
		);
	}
});

module.exports = AdminUserNotification;