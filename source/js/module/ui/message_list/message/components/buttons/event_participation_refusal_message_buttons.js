const	React			= require('react'),
		{Button}		= require('module/ui/button/button'),
		Bootstrap		= require('styles/bootstrap-custom.scss'),
		InviteStyles	= require('styles/pages/events/b_invite.scss');

const EventParticipationRefusalMessageButtons = React.createClass({
	propTypes: {
		onGotIt: React.PropTypes.func.isRequired
	},
	render: function() {
		return (
			<div className="eInvite_buttons">
				<Button
					onClick				= {this.props.onGotIt}
					text				= {'Got it'}
					extraStyleClasses	= {'mHalfWidth mMarginRight'}/>
			</div>
		);
	}
});

module.exports = EventParticipationRefusalMessageButtons;