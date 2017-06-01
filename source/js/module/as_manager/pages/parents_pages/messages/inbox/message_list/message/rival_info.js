const	React			= require('react'),
		Bootstrap		= require('styles/bootstrap-custom.scss'),
		InviteStyles	= require('styles/pages/events/b_invite.scss');

const RivalName = React.createClass({
	propTypes: {
		message: React.PropTypes.object.isRequired
	},
	getRival: function() {
		const	message	= this.props.message,
				child	= message.child;

		let rival;

		if(child.schoolId === message.inviterSchoolId) {
			rival = message.invitedSchool
		} else if(child.schoolId === message.invitedSchoolId) {
			rival = message.inviterSchool
		}

		return rival;
	},
	render: function() {
		const rival = this.getRival();

		return (
			<span>
				<h4> {rival.name}</h4>
			</span>
		);
	}
});

module.exports = RivalName;