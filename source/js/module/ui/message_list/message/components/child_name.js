const	React			= require('react'),
		Bootstrap		= require('styles/bootstrap-custom.scss'),
		InviteStyles	= require('styles/pages/events/b_invite.scss');

const ChildName = React.createClass({
	propTypes: {
		message: React.PropTypes.object.isRequired
	},
	render: function() {
		return (
			<h4> {`${this.props.message.playerDetailsData.firstName} ${this.props.message.playerDetailsData.lastName}`}</h4>
		);
	}
});

module.exports = ChildName;