import {If} from 'module/ui/if/if';
import * as propz from "propz";

import {ClubParticipationMessageSchoolLogo} from 'module/ui/message_list/message/components/club_participation_message_school_logo';
import {ClubParticipationMessageHeader} from 'module/ui/message_list/message/components/club_participation_message_header';
import {ClubParticipationMessageMiddleInfoSection} from 'module/ui/message_list/message/components/club_participation_message_middle_info_section';
import {ClubParticipationMessageText} from 'module/ui/message_list/message/components/club_participation_message_text';
import {ClubParticipationMessageVenue} from 'module/ui/message_list/message/components/club_participation_message_venue';

const	React							= require('react');

const	EventInvitationMessageButtons		= require('module/ui/message_list/message/components/buttons/event_invitation_message_buttons'),
		MessageText							= require('module/ui/message_list/message/components/message_text'),
		MessageStatus						= require('module/ui/message_list/message/components/message_status'),
		MessageConsts						= require('module/ui/message_list/message/const/message_consts'),
		EventMessageComments				= require('module/ui/message_list/message/components/comments/event_message_comments'),
		Venue								= require('module/ui/message_list/message/components/venue');

const	Bootstrap						= require('styles/bootstrap-custom.scss'),
		Style							= require('styles/ui/b_club_participation_message.scss');

const ClubParticipationMessage = React.createClass({
	propTypes: {
		message:				React.PropTypes.object.isRequired,
		type:					React.PropTypes.string.isRequired,
		userType:				React.PropTypes.string,
		region :				React.PropTypes.string,
		onAction:				React.PropTypes.func.isRequired,
		onClickShowComments: 	React.PropTypes.func.isRequired,
		onClickSubmitComment: 	React.PropTypes.func.isRequired,
		checkComments: 			React.PropTypes.func.isRequired,
		user: 					React.PropTypes.object.isRequired
	},
	componentWillUnmount: function(){
		clearInterval(this.timerID);
	},
	/**
	 * Function start timer, which send request on server with count comment
	 * If count don't equal old count, then call function with get comments
	 */
	componentWillReceiveProps: function(newProps){
		if (Boolean(this.props.message.isShowComments) === false && Boolean(newProps.message.isShowComments) === true) {
			this.timerID = setInterval(
				() => this.props.checkComments(newProps.message.id),
				30000
			);
		}
		if (Boolean(this.props.message.isShowComments) === true && Boolean(newProps.message.isShowComments) === false) {
			clearInterval(this.timerID);
		}
	},
	onAccept: function() {
		const	messageId	= this.props.message.id,
				messageKind	= this.props.message.kind,
				actionType	= MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.ACCEPT;

		this.props.onAction(
			messageId,
			messageKind,
			actionType
		);
	},
	onDecline: function() {
		const	messageId	= this.props.message.id,
				messageKind	= this.props.message.kind,
				actionType	= MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.DECLINE;

		this.props.onAction(
			messageId,
			messageKind,
			actionType
		);
	},
	renderButtons: function() {
		switch (this.props.type) {
			case MessageConsts.MESSAGE_TYPE.INBOX:
				return (
					<EventInvitationMessageButtons
						acceptButtonText = {'Book now'}
						onAccept = {this.onAccept}
						onDecline = {this.onDecline}
					/>
				);
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
	renderShowCommentButton: function () {
		if(this.props.userType === MessageConsts.USER_TYPE.STUDENT) {
			const isShowComments = Boolean(this.props.message.isShowComments);

			let linkText;
			if (isShowComments) {
				linkText = 'Hide chat';
			} else {
				linkText = 'Chat';
			}

			return (
				<div className="eInviteDiscussionLink">
					<a onClick = {this.onClickShowComments}>{ linkText }</a>
				</div>
			);
		}
	},
	onClickShowComments: function(){
		this.props.onClickShowComments(this.props.message.id);
	},
	onClickSubmitComment:function(newCommentText, replyComment){
		this.props.onClickSubmitComment(newCommentText, replyComment, this.props.message.id);
	},
	render: function() {
		const	isShowComments	= Boolean(this.props.message.isShowComments),
				isSyncComments	= Boolean(this.props.message.isSyncComments),
				comments		= typeof this.props.message.comments === 'undefined' ? [] : this.props.message.comments;

		return (
			<div className='bClubParticipationMessage'>
				<div className="row">
					<div className="col-md-6 col-sm-6">
						<div className='eClubParticipationMessage_info'>
							<div className='eClubParticipationMessage_topSection'>
								<ClubParticipationMessageSchoolLogo message={this.props.message}/>
								<ClubParticipationMessageHeader message={this.props.message} region={this.props.region}/>
								<ClubParticipationMessageMiddleInfoSection message={this.props.message} region={this.props.region}/>
							</div>
							<div className='eClubParticipationMessage_bottomSection'>
								<ClubParticipationMessageText message={this.props.message}/>
							</div>
						</div>
						{ this.renderButtons() }
						{ this.renderStatus() }
						{ this.renderShowCommentButton() }
					</div>
					<div className='col-md-6 col-sm-6'>
						<ClubParticipationMessageVenue venue={propz.get(this.props.message, ['clubData', 'venue', 'placeData'])}/>
					</div>
				</div>
				<If condition = { isShowComments }>
					<div className="eInvite_comments">
						<EventMessageComments
							user			= { this.props.user }
							comments		= { comments }
							onSubmitComment	= { this.onClickSubmitComment }
							isSyncComments	= { isSyncComments }
						/>
					</div>
				</If>
			</div>
		);
	}
});

module.exports = ClubParticipationMessage;