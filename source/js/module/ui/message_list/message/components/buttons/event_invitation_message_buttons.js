const	React			= require('react'),
		{Button}		= require('module/ui/button/button'),
		Bootstrap		= require('styles/bootstrap-custom.scss'),
		InviteStyles	= require('styles/pages/events/b_invite.scss');

const EventInvitationMessageButtons = React.createClass({
	propTypes: {
		acceptButtonText:	React.PropTypes.string.isRequired,
		onAccept:			React.PropTypes.func.isRequired,
		onDecline:			React.PropTypes.func.isRequired
	},
	getDefaultProps: function() {
		return {
			acceptButtonText: 'Accept'
		};
	},
	render: function() {
		return (
			<div className="eInvite_buttons mMessage">
				<Button
					onClick				= {this.props.onAccept}
					text				= {this.props.acceptButtonText}
					extraStyleClasses	= {'mHalfWidth mMarginRight'}/>
				<Button
					onClick				= {this.props.onDecline}
					text				= {'Decline'}
					extraStyleClasses	= {'mCancel mHalfWidth'}/>
			</div>
		);
	}
});

module.exports = EventInvitationMessageButtons;