/**
 * Created by Woland on 02.05.2017.
 */
const 	React 		= require('react'),
		Morearty	= require('morearty'),
		Model 		= require('module/as_admin/pages/admin_user/admin_user_notification_channel_class'),
		Grid 		= require('module/ui/grid/grid');

const AdminUserNotificationChannel = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		userId: React.PropTypes.string.isRequired
	},
	componentWillMount: function () {
		this.model = new Model(this);
	},
	render: function () {
		return (
			<Grid model={this.model.grid}/>
		);
	}
});

module.exports = AdminUserNotificationChannel;