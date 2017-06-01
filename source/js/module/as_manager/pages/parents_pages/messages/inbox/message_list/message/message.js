const	React			= require('react'),
		SchoolLogo		= require('module/as_manager/pages/parents_pages/messages/inbox/message_list/message/components/school_logo'),
		ChildName		= require('module/as_manager/pages/parents_pages/messages/inbox/message_list/message/components/child_name'),
		TeamInfo		= require('module/as_manager/pages/parents_pages/messages/inbox/message_list/message/components/team_info'),
		EventInfo		= require('module/as_manager/pages/parents_pages/messages/inbox/message_list/message/components/event_info'),
		Buttons			= require('module/as_manager/pages/parents_pages/messages/inbox/message_list/message/components/buttons'),
		Venue			= require('module/as_manager/pages/parents_pages/messages/inbox/message_list/message/components/venue'),
		Bootstrap		= require('styles/bootstrap-custom.scss'),
		InviteStyles	= require('styles/pages/events/b_invite.scss');

const Message = React.createClass({
	propTypes: {
		message: React.PropTypes.object.isRequired
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
								<Buttons/>
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

module.exports = Message;