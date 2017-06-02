const	React			= require('react'),
		Button			= require('module/ui/button/button'),
		Bootstrap		= require('styles/bootstrap-custom.scss'),
		InviteStyles	= require('styles/pages/events/b_invite.scss');

const EventInvitationMessageButtons = React.createClass({
	render: function() {
		return (
			<div className="eInvite_buttons">
				<Button
					text				= {'Accept'}
					extraStyleClasses	= {'mHalfWidth mMarginRight'}/>
				<Button
					text				= {'Decline'}
					extraStyleClasses	= {'mCancel mHalfWidth'}/>
			</div>
		);
	}
});

module.exports = EventInvitationMessageButtons;