const	React			= require('react'),
		RivalLogo		= require('module/as_manager/pages/parents_pages/messages/inbox/message_list/message/rival_logo'),
		ChildName		= require('module/as_manager/pages/parents_pages/messages/inbox/message_list/message/child_name'),
		RivalInfo		= require('module/as_manager/pages/parents_pages/messages/inbox/message_list/message/rival_info'),
		EventInfo		= require('module/as_manager/pages/parents_pages/messages/inbox/message_list/message/event_info'),
		Buttons			= require('module/as_manager/pages/parents_pages/messages/inbox/message_list/message/buttons'),
		Venue			= require('module/as_manager/pages/parents_pages/messages/inbox/message_list/message/venue'),
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
							<RivalLogo message={this.props.message}/>
							<div className="eInvite_info col-md-7 col-sm-7">
								<ChildName message={this.props.message}/>
								<RivalInfo message={this.props.message}/>
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