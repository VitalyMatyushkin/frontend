const	React			= require('react'),
		RivalLogo		= require('module/as_manager/pages/parents_pages/messages/inbox/message_list/message/rival_logo'),
		EventInfo		= require('module/as_manager/pages/parents_pages/messages/inbox/message_list/message/event_info'),
		Bootstrap		= require('styles/bootstrap-custom.scss'),
		InviteStyles	= require('styles/pages/events/b_invite.scss');

const Message = React.createClass({
	propTypes: {
		message: React.PropTypes.array.isRequired
	},
	render: function() {
		return (
			<div className='bInvite'>
				<div className="row">
					<div className="col-md-6 eInvite_left">
						<div className="row">
							<RivalLogo />
							<div className="eInvite_info col-md-7 col-sm-7">
								<h4> {rival.name }</h4>

								<div>
									<div className="eInvite_buttons">
										<Button
											href				= {`/#invites/${inviteId}/accept`}
											text				= {'Accept'}
											extraStyleClasses	= {'mHalfWidth mMarginRight'}
										/>
										<Button
											text				= {'Decline'}
											onClick				= {() => this.getInviteRequest(inviteId,'decline')}
											extraStyleClasses	= {'mCancel mHalfWidth'}
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-md-6">
						<div className="eInvite_map">{venueArea}</div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = Message;