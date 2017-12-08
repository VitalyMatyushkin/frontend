const	React								= require('react'),
		classNames 							= require('classnames'),

		SchoolLogo							= require('module/ui/message_list/message/components/school_logo'),
		ChildName							= require('module/ui/message_list/message/components/child_name'),
		TeamInfo							= require('module/ui/message_list/message/components/team_info'),
		MessageText							= require('module/ui/message_list/message/components/message_text'),
		EventInfo							= require('module/ui/message_list/message/components/event_info'),
		EventInvitationMessageButtons		= require('module/ui/message_list/message/components/buttons/event_invitation_message_buttons'),
		Venue								= require('module/ui/message_list/message/components/venue'),
		MessageStatus						= require('module/ui/message_list/message/components/message_status'),
		MessageConsts						= require('module/ui/message_list/message/const/message_consts'),
		EventMessageComments 				= require('module/ui/message_list/message/components/comments/event_message_comments'),
		ConsentRequestTemplate 				= require('module/ui/message_list/message/components/template/template'),
		{If}								= require('module/ui/if/if'),

		CONSENT_REQUEST_TEMPLATE_FIELD_TYPE = require('module/helpers/consts/schools').CONSENT_REQUEST_TEMPLATE_FIELD_TYPE,
	
		Bootstrap							= require('styles/bootstrap-custom.scss'),
		InviteStyles						= require('styles/pages/events/b_invite.scss');

const EventInvitationMessage = React.createClass({
	propTypes: {
		message:				React.PropTypes.object.isRequired,
		type:					React.PropTypes.string.isRequired,
		userType:				React.PropTypes.string.isRequired,
		onAction:				React.PropTypes.func.isRequired,
		onClickShowComments: 	React.PropTypes.func.isRequired,
		onClickSubmitComment: 	React.PropTypes.func.isRequired,
		checkComments: 			React.PropTypes.func.isRequired,
		template:				React.PropTypes.object.isRequired,
		user: 					React.PropTypes.object.isRequired
	},
	getDefaultProps: function(){
		return {
			template: {}
		}
	},
	componentWillUnmount: function(){
		clearInterval(this.timerID);
	},
	getInitialState: function(){
		return {
			templateData: 			[],
			indexFieldWithError: 	[]
		}
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
	isNumeric: function(value) {
		return !isNaN(parseFloat(value)) && isFinite(value);
	},
	//we check all field manually
	isAllRequiredFieldFilled: function(){
		const templateData = this.state.templateData;
		const allRequiredFieldNotFilledIndexes = [];
		templateData.forEach((field, index) => {
			if (field.isRequired && field.value === '') {
				allRequiredFieldNotFilledIndexes.push(index);
			}
		});
		this.setState({indexFieldWithError: allRequiredFieldNotFilledIndexes});
		return allRequiredFieldNotFilledIndexes.length === 0;
	},
	isAllNumericFieldValid: function(){
		const templateData = this.state.templateData;
		const allRequiredFieldNotFilledIndexes = [];
		
		templateData.forEach((field, index) => {
			if (field.type === CONSENT_REQUEST_TEMPLATE_FIELD_TYPE.NUMBER && !this.isNumeric(field.value)) {
				allRequiredFieldNotFilledIndexes.push(index);
			}
		});
		this.setState({indexFieldWithError: allRequiredFieldNotFilledIndexes});
		return allRequiredFieldNotFilledIndexes.length === 0;
	},
	onAccept: function() {
		const	messageId	= this.props.message.id,
				messageKind	= this.props.message.kind,
				actionType	= MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.ACCEPT;
		
		const templateData = this.state.templateData;
		
		if (this.isAllRequiredFieldFilled() && this.isAllNumericFieldValid()) {
			this.props.onAction(
				messageId,
				messageKind,
				actionType,
				templateData
			);
		}
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
						onAccept	= {this.onAccept}
						onDecline	= {this.onDecline}
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
	isRenderConsentRequestTemplate: function(){
		const 	message 	= this.props.message,
				template 	= this.props.template,
				type 		= this.props.type;
		return (
			type === MessageConsts.MESSAGE_TYPE.ARCHIVE &&
			Array.isArray(message.fields) && message.fields.length > 0
			) || (
				type === MessageConsts.MESSAGE_TYPE.INBOX &&
				Array.isArray(template.fields) && template.fields.length > 0
			);
	},
	renderConsentRequestTemplate: function(){
		if (this.isRenderConsentRequestTemplate()) {
			return (
				<div className="col-md-3">
					<ConsentRequestTemplate
						template 			= { this.props.template }
						message 			= { this.props.message }
						onChange 			= { this.onChange }
						indexFieldWithError = { this.state.indexFieldWithError }
						type 				= { this.props.type }
					/>
				</div>
			);
		} else {
			return null;
		}
	},
	onClickShowComments: function(){
		this.props.onClickShowComments(this.props.message.id);
	},
	onClickSubmitComment:function(newCommentText, replyComment){
		this.props.onClickSubmitComment(newCommentText, replyComment, this.props.message.id);
	},
	onChange: function(templateData){
		this.setState({
			templateData: templateData
		});
	},
	getLinkText: function(isShowComments){
		return isShowComments ? 'Hide chat' : 'Chat';
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
	render: function() {
		const	isShowComments	= Boolean(this.props.message.isShowComments),
				isSyncComments	= Boolean(this.props.message.isSyncComments),
				comments		= typeof this.props.message.comments === 'undefined' ? [] : this.props.message.comments;
		
		const messageLeftBlockStyle = classNames({
			'eInvite_left': true,
			'col-md-6': 	!this.isRenderConsentRequestTemplate(),
			'col-md-5': 	this.isRenderConsentRequestTemplate()
		});
		const messageRightBlockStyle = classNames({
			'col-md-6': 	!this.isRenderConsentRequestTemplate(),
			'col-md-4': 	this.isRenderConsentRequestTemplate()
		});
		
		
		return (
			<div className='bInvite'>
				<div className="row">
					<div className = { messageLeftBlockStyle } >
						<div className="row">
							<SchoolLogo
								message={this.props.message}
							/>
							<div className="eInvite_info col-md-7 col-sm-7">
								<ChildName
									message={this.props.message}
								/>
								<TeamInfo
									message={this.props.message}
								/>
								<EventInfo
									message={this.props.message}
								/>
								<MessageText
									message={this.props.message}
								/>
								{ this.renderButtons() }
								{ this.renderStatus() }
								{ this.renderShowCommentButton() }
							</div>
						</div>
					</div>
					{this.renderConsentRequestTemplate()}
					<div className = { messageRightBlockStyle } >
						<Venue
							message={this.props.message}
						/>
					</div>
				</div>
				<If condition = { isShowComments }>
					<div className="eInvite_comments">
						<EventMessageComments
							user			= {this.props.user}
							comments		= {comments}
							onSubmitComment	= {this.onClickSubmitComment}
							isSyncComments 	= {isSyncComments}
						/>
					</div>
				</If>
			</div>
		);
	}
});

module.exports = EventInvitationMessage;