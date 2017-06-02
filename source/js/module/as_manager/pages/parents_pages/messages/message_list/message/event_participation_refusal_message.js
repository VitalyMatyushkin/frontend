const	React									= require('react'),
		SchoolLogo								= require('module/as_manager/pages/parents_pages/messages/message_list/message/components/school_logo'),
		ChildName								= require('module/as_manager/pages/parents_pages/messages/message_list/message/components/child_name'),
		TeamInfo								= require('module/as_manager/pages/parents_pages/messages/message_list/message/components/team_info'),
		EventInfo								= require('module/as_manager/pages/parents_pages/messages/message_list/message/components/event_info'),
		EventParticipationRefusalMessageButtons	= require('module/as_manager/pages/parents_pages/messages/message_list/message/components/buttons/event_participation_refusal_message_buttons'),
		Venue									= require('module/as_manager/pages/parents_pages/messages/message_list/message/components/venue'),
		MessageConsts							= require('module/as_manager/pages/parents_pages/messages/message_list/message/const/message_consts'),
		MessageStatus							= require('module/as_manager/pages/parents_pages/messages/message_list/message/components/message_status'),
		Bootstrap								= require('styles/bootstrap-custom.scss'),
		InviteStyles							= require('styles/pages/events/b_invite.scss');

const EventParticipationRefusalMessage = React.createClass({
	propTypes: {
		message: React.PropTypes.object.isRequired
	},
	renderButtons: function() {
		switch (this.props.type) {
			case MessageConsts.MESSAGE_TYPE.INBOX:
				return (<EventParticipationRefusalMessageButtons/>);
			default:
				return null;
		}
	},
	renderStatus: function() {
		switch (this.props.type) {
			case MessageConsts.MESSAGE_TYPE.ARCHIVE:
				return (
					<MessageStatus
						message	= {this.props.message}
						type	= {this.props.type}
					/>
				);
			default:
				return null;
		}
	},
	render: function() {
		console.log(this.props.message);

		return (
			<div className='bInvite'>
				<div className="row">
					<div className="col-md-6 eInvite_left">
						<div className="row">
							<SchoolLogo message={this.props.message}/>
							<div className="eInvite_info col-md-7 col-sm-7">
								<ChildName message={this.props.message}/>
								<TeamInfo message={this.props.message}/>
								<EventInfo message={this.props.message}/>
								{this.renderButtons()}
								{this.renderStatus()}
							</div>
						</div>
					</div>
					<div className="col-md-6">
						<Venue message={this.props.message}/>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = EventParticipationRefusalMessage;