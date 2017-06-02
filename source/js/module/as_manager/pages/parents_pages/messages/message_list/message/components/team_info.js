const	React			= require('react'),
		MessageHelper	= require('module/as_manager/pages/parents_pages/messages/message_list/message/helpers/message_helper'),
		Bootstrap		= require('styles/bootstrap-custom.scss'),
		InviteStyles	= require('styles/pages/events/b_invite.scss');

const TeamInfo = React.createClass({
	propTypes: {
		message: React.PropTypes.object.isRequired
	},
	render: function() {
		const school = MessageHelper.getSchool(this.props.message);

		return (
			<span>
				<h4> {school.name}</h4>
			</span>
		);
	}
});

module.exports = TeamInfo;