const	React								= require('react');

const	EventInvitationMessage				= require('module/ui/message_list/message/event_invitation_message'),
		EventParticipationRefusalMessage	= require('module/ui/message_list/message/event_participation_refusal_message'),
		EventParticipationMessage			= require('module/ui/message_list/message/event_participation_message'),
		ClubParticipationMessage			= require('module/ui/message_list/message/club_participation_message');

const	InfiniteScroll						= require('react-infinite-scroller'),
		{ MessagesLoader }					= require('module/ui/message_list/messages_loader'),
		MessageConsts						= require('module/ui/message_list/message/const/message_consts');

const MessageList = React.createClass({
	propTypes: {
		messageType:			React.PropTypes.string.isRequired,
		userType:				React.PropTypes.string,
		loadMessages:			React.PropTypes.func.isRequired,
		onAction:				React.PropTypes.func.isRequired,
		user: 					React.PropTypes.object.isRequired,
		onClickShowComments: 	React.PropTypes.func.isRequired,
		onClickSubmitComment: 	React.PropTypes.func.isRequired,
		checkComments: 			React.PropTypes.func.isRequired,
		//array custom consent request template templates of school
		templates: 				React.PropTypes.array.isRequired,
		region:                 React.PropTypes.string
	},
	getDefaultProps: function(){
		return {
			templates: []
		}
	},
	componentWillMount: function () {
		this.setState({
			messages:	[],
			hasMore:	true
		});
	},
	loadMessages: function (page) {
		return this.props.loadMessages(page).then(_messages => {
			let messages = this.state.messages;
			messages = messages.concat(_messages);
			this.setState({
				messages:	messages,
				hasMore:	_messages.length !== 0
			});

			return true;
		});
	},
	renderMessages: function() {
		let messages = [];

		if(
			typeof this.state.messages !== 'undefined' &&
			this.state.messages.length > 0
		) {
			messages = this.state.messages.map(message => {
				switch (message.kind) {
					case MessageConsts.MESSAGE_KIND.INVITATION:
						//For each school, we show a separate consent request template,
						//if it does not exist (template === undefined), the child component will correctly handle this case
						const template = this.props.templates.find(template => template.schoolId === message.schoolId);
						return (
							<EventInvitationMessage
								key						= {message.id}
								message					= {message}
								userType				= {this.props.userType}
								type					= {this.props.messageType}
								onAction				= {this.props.onAction}
								user 					= {this.props.user}
								onClickShowComments 	= {this.props.onClickShowComments}
								onClickSubmitComment 	= {this.props.onClickSubmitComment}
								checkComments 			= {this.props.checkComments}
								template 				= {template}
								region                  = {this.props.region}
							/>
						);
					case MessageConsts.MESSAGE_KIND.REFUSAL:
						return (
							<EventParticipationRefusalMessage
								key						= {message.id}
								message					= {message}
								userType				= {this.props.userType}
								type					= {this.props.messageType}
								onAction				= {this.props.onAction}
								user 					= {this.props.user}
								onClickShowComments 	= {this.props.onClickShowComments}
								onClickSubmitComment 	= {this.props.onClickSubmitComment}
								checkComments 			= {this.props.checkComments}
								region                  = {this.props.region}
							/>
						);
					case MessageConsts.MESSAGE_KIND.AVAILABILITY:
						return (
							<EventParticipationMessage
								key						= {message.id}
								message					= {message}
								userType				= {this.props.userType}
								type					= {this.props.messageType}
								onAction				= {this.props.onAction}
								user 					= {this.props.user}
								onClickShowComments 	= {this.props.onClickShowComments}
								onClickSubmitComment 	= {this.props.onClickSubmitComment}
								checkComments 			= {this.props.checkComments}
								region                  = {this.props.region}
							/>
						);
					case MessageConsts.MESSAGE_KIND.CLUB_PARTICIPANT_INVITE:
						return (
							<ClubParticipationMessage
								key						= {message.id}
								message					= {message}
								userType				= {this.props.userType}
								type					= {this.props.messageType}
								onAction				= {this.props.onAction}
								user 					= {this.props.user}
								onClickShowComments 	= {this.props.onClickShowComments}
								onClickSubmitComment 	= {this.props.onClickSubmitComment}
								checkComments 			= {this.props.checkComments}
								region                  = {this.props.region}
							/>
						);
				}
			});
		}

		return messages;
	},
	render: function() {
		let content = null;

		if(
			this.state.messages.length === 0 &&
			!this.state.hasMore
		) {
			content = (
				<div className="eInvites_processing">
					<span>There are no messages to display.</span>
				</div>
			);
		} else {
			content = (
				<InfiniteScroll
					pageStart	= { 0 }
					loadMore	= { page => this.loadMessages(page) }
					hasMore		= { this.state.hasMore }
					loader		= { <MessagesLoader/> }
				>
					<div className="eInvites_list container">
						{ this.renderMessages() }
					</div>
				</InfiniteScroll>
			);
		}

		return content;
	}
});

module.exports = MessageList;