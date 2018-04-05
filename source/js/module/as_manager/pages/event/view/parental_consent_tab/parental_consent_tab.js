const	React						= require('react'),
		Morearty					= require('morearty'),
		Immutable					= require('immutable'),
		RoleHelper 					= require('module/helpers/role_helper'),
		TeamHelper                  = require('module/ui/managers/helpers/team_helper'),
		MessageConsts				= require('module/ui/message_list/message/const/message_consts'),
		PlayerStatusTable			= require('module/ui/player_status_table/player_status_table'),
		Loader						= require('module/ui/loader'),
		{RegionHelper} 	            = require('module/helpers/region_helper'),
		ParentalConsentTabStyle		= require('../../../../../../../styles/ui/b_parental_consent_tab/b_parental_consent_tab.scss');

import {MessageListActions} from 'module/as_manager/pages/messages/message_list_wrapper/message_list_actions/message_list_actions'
import {MessageListActions as MessageListActionsParents} from 'module/as_manager/pages/parents_pages/messages/message_list_wrapper/message_list_actions/message_list_actions';

const ParentalConsentTab = React.createClass({
	mixins: [Morearty.Mixin],
	listeners: [],
	propTypes: {
		schoolId:	React.PropTypes.string.isRequired,
		eventId:	React.PropTypes.string.isRequired
	},
	componentWillMount: function() {
		const binding = this.getDefaultBinding();
		const eventBinding = this.getBinding().event;
		
		binding.set('isSync', false);
		
		let promises = [window.Server.profile.get()]; //common service for school staff and parent
		
		const role = RoleHelper.getLoggedInUserRole(this);
		
		if (role === 'PARENT') {
			//for role parent we load consent request template
			promises = promises.concat([
				window.Server.consentRequestTemplate.get(this.props.schoolId),
				MessageListActions.loadParentRoleParentalConsentMessagesByEventId(this.props.eventId)
			]);
			
			Promise.all(promises).then(result => {
				const	user 		= result[0],
						template 	= result[1],
						messages 	= result[2];
				
				binding.atomically()
					.set('messages', 	Immutable.fromJS(messages))
					.set('loggedUser', 	Immutable.fromJS(user))
					.set('template', 	Immutable.fromJS(template))
					.set('isSync',		true)
					.commit();
			});
		} else {
			promises = promises.concat(MessageListActions.loadParentalConsentMessagesByEventId(this.props.schoolId, this.props.eventId));
			Promise.all(promises).then(result => {
				const user = result[0];
				let messages = result[1];

				const teamPlayers = TeamHelper.getPlayers(this.props.schoolId, eventBinding.toJS());
				const msgPlayers = this.getPlayersFromMessages(messages);
				//sorts an array of messages in the same order as the players in the team
				let messagesSortedAsWellAsTeam = [];

				teamPlayers.forEach(teamPlayer => {
					const index = msgPlayers.findIndex(msgPlayer =>
						teamPlayer.userId === msgPlayer.userId && teamPlayer.permissionId === msgPlayer.permissionId
					);

					if(index === -1) { //not notified players
						messagesSortedAsWellAsTeam.push(
							{
								playerDetails: {
									userId: teamPlayer.userId,
									permissionId: teamPlayer.permissionId
								},
								playerDetailsData: teamPlayer,
								schoolId: this.props.schoolId,
								invitationStatus: 'NOT_SEND'
							}
						);
					} else {
						messagesSortedAsWellAsTeam.push(messages[index]);
					}
				});

				binding.set('messages', 	Immutable.fromJS(messagesSortedAsWellAsTeam));
				binding.set('loggedUser', 	Immutable.fromJS(user));
				binding.set('isSync', 		true);
			});
		}

		this.addListeners();
	},
	componentWillUnmount: function() {
		this.listeners.forEach(listener => this.getDefaultBinding().removeListener(listener));
	},
	getPlayersFromMessages: function (messages) {
		return messages.map(msg => msg.playerDetails);
	},
	loadAndSetMessages: function() {
		const role = RoleHelper.getLoggedInUserRole(this);
		
		if (role === 'PARENT') {
			MessageListActions.loadParentRoleParentalConsentMessagesByEventId(this.props.eventId).then(messages => {
				this.getDefaultBinding().atomically()
				.set('isSync',		true)
				.set('messages',	Immutable.fromJS(messages))
				.commit();
			});
		} else {
			MessageListActions.loadParentalConsentMessagesByEventId(this.props.schoolId, this.props.eventId).then(messages => {
				this.getDefaultBinding().atomically()
				.set('isSync',		true)
				.set('messages',	Immutable.fromJS(messages))
				.commit();
			});
		}
	},
	addListeners: function() {
		this.listeners.push(this.getDefaultBinding().sub('isSync').addListener(descriptor => {
			const isSync = descriptor.getCurrentValue();

			if(!isSync) {
				this.loadAndSetMessages();
			}
		}));
	},
	getPlayers: function() {
		return this.getDefaultBinding().toJS('messages').map(m => {
			const name = `${m.playerDetailsData.firstName} ${m.playerDetailsData.lastName}`;

			return {
				id:			m.playerDetailsData.id,
				name:		name,
				status:		m.invitationStatus
			}
		});
	},
	onAction: function(messageId, messageKind, actionType, templateData) {
		this.onActionByMessageKindAndActionType(messageId, messageKind, actionType, templateData);
	},
	onActionByMessageKindAndActionType: function(messageId, messageKind, actionType, templateData) {
		switch (messageKind) {
			case MessageConsts.MESSAGE_KIND.INVITATION:
				this.onActionForRefusalMessageByActionType(messageId, actionType, templateData);
				break;
		}
	},
	onActionForRefusalMessageByActionType: function(messageId, actionType, templateData) {
		switch (actionType) {
			case MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.ACCEPT:
				
				MessageListActionsParents.acceptInvitationMessage(messageId).then(() => {
					return MessageListActionsParents.sendConsentRequestTemplateWithValue(messageId, templateData)
				})
				.then(() => {
					this.setSync(false);
					
					this.loadAndSetMessages();
				});
				break;
			case MessageConsts.MESSAGE_INVITATION_ACTION_TYPE.DECLINE:
				MessageListActionsParents.declineInvitationMessage(messageId).then(() => {
					this.setSync(false);
					
					this.loadAndSetMessages();
				});
				break;
		}
	},
	setSync: function(value) {
		this.getDefaultBinding().set('isSync', value);
	},
	onClickShowComments: function(messageId){
		const 	binding			= this.getDefaultBinding(),
				messageIndex 	= binding.toJS('messages').findIndex(message => message.id === messageId),
				isShowComments 	= Boolean(binding.toJS(`messages.${messageIndex}.isShowComments`));
		
		binding.atomically()
			.set(`messages.${messageIndex}.isShowComments`, !isShowComments)
			.set(`messages.${messageIndex}.isSyncComments`, false)
			.commit();
		
		const role = RoleHelper.getLoggedInUserRole(this);
		
		if (role === 'PARENT') {
			if (!isShowComments) {
				window.Server.childrenEventMessageComments.get({messageId}).then(
					comments => {
						binding.atomically()
							.set(`messages.${messageIndex}.comments`, 		Immutable.fromJS(comments))
							.set(`messages.${messageIndex}.commentsCount`, 	comments.length)
							.set(`messages.${messageIndex}.isSyncComments`, true)
							.commit();
					}
				);
			}
		} else {
			if (!isShowComments) {
				window.Server.schoolEventMessageComments.get({schoolId: this.props.schoolId, messageId}).then(
					comments => {
						binding.atomically()
							.set(`messages.${messageIndex}.comments`, 		Immutable.fromJS(comments))
							.set(`messages.${messageIndex}.commentsCount`, 	comments.length)
							.set(`messages.${messageIndex}.isSyncComments`, true)
							.commit();
					}
				);
			}
		}
		

	},
	onClickSubmitComment: function(newCommentText, replyComment, messageId){
		const 	binding 		= this.getDefaultBinding(),
				messageIndex 	= binding.toJS('messages').findIndex(message => message.id === messageId);
		
		const postData = {
			text: newCommentText
		};
		if(typeof replyComment !== 'undefined') {
			postData.replyToCommentId = replyComment.id;
		}
		
		const role = RoleHelper.getLoggedInUserRole(this);
		
		if (role === 'PARENT') {
			return window.Server.childrenEventMessageComments.post(
				{
					messageId: messageId
				},
				postData
			)
			.then(comment => {
				const	comments		= binding.toJS(`messages.${messageIndex}.comments`),
						commentsCount	= binding.toJS(`messages.${messageIndex}.commentsCount`);
				
				comments.push(comment);
				
				binding.atomically()
					.set(`messages.${messageIndex}.commentsCount`, 	Immutable.fromJS(commentsCount + 1))
					.set(`messages.${messageIndex}.comments`, 		Immutable.fromJS(comments))
					.commit();
			});
		} else {
			return window.Server.schoolEventMessageComments.post(
				{
					schoolId: 	this.props.schoolId,
					messageId: 	messageId
				},
				postData
			)
			.then(comment => {
				const	comments		= binding.toJS(`messages.${messageIndex}.comments`),
						commentsCount	= binding.toJS(`messages.${messageIndex}.commentsCount`);
				
				comments.push(comment);
				
				binding.atomically()
					.set(`messages.${messageIndex}.commentsCount`, 	Immutable.fromJS(commentsCount + 1))
					.set(`messages.${messageIndex}.comments`, 		Immutable.fromJS(comments))
					.commit();
			});
		}
		
	},
	checkComments: function(messageId) {
		const 	binding 		= this.getDefaultBinding(),
				messageIndex 	= binding.toJS('messages').findIndex(message => message.id === messageId);
		
		const role = RoleHelper.getLoggedInUserRole(this);
		
		if (role === 'PARENT') {
			return window.Server.childrenEventMessageCommentsCount.get({
				messageId: messageId
			})
			.then(res => {
				const oldCount = binding.get(`messages.${messageIndex}.commentsCount`);
				if(oldCount && oldCount !== res.count) {
					this.setComments(messageId);
				}
				return true;
			});
		} else {
			return window.Server.schoolEventMessageCommentsCount.get({
				schoolId: 	this.props.schoolId,
				messageId: 	messageId
			})
			.then(res => {
				const oldCount = binding.get(`messages.${messageIndex}.commentsCount`);
				if(oldCount && oldCount !== res.count) {
					this.setComments(messageId);
				}
				return true;
			});
		}
	},
	setComments: function(messageId){
		const 	binding 		= this.getDefaultBinding(),
				messageIndex 	= binding.toJS('messages').findIndex(message => message.id === messageId);
		
		const role = RoleHelper.getLoggedInUserRole(this);
		
		if (role === 'PARENT') {
			return window.Server.childrenEventMessageComments.get(
				{
					messageId: messageId
				}, {
					filter: {
						limit: 100
					}
				})
			.then(comments => {
				binding.atomically()
					.set(`messages.${messageIndex}.commentsCount`, 	comments.length)
					.set(`messages.${messageIndex}.comments`, 		Immutable.fromJS(comments))
					.commit();
				
				return true;
			});
		} else {
			return window.Server.schoolEventMessageComments.get(
				{
					schoolId: this.props.schoolId,
					messageId: messageId
				}, {
					filter: {
						limit: 100
					}
				})
			.then(comments => {
				binding.atomically()
					.set(`messages.${messageIndex}.commentsCount`, 	comments.length)
					.set(`messages.${messageIndex}.comments`, 		Immutable.fromJS(comments))
					.commit();
				
				return true;
			});
		}
	},
	
	render: function() {
		const	binding		= this.getDefaultBinding();

		const	messages	= binding.toJS('messages'),
				isSync		= Boolean(binding.toJS('isSync'));

		if(!isSync) {
			return (
				<div className="bParentalConsentTab">
					<Loader/>
				</div>
			);
		} else if (isSync && messages.length > 0) {
			const 	role 		= RoleHelper.getLoggedInUserRole(this),
					user 		= binding.toJS('loggedUser'),
					template 	= binding.toJS('template') || {}; //default value if template is undefined (it possible, if role !== parent)
			return (
				<div className="bParentalConsentTab">
					<PlayerStatusTable
						players 				= { this.getPlayers() }
						messages 				= { messages }
						role 					= { role }
						user 					= { user }
						template 				= { template }
						onClickShowComments 	= { this.onClickShowComments }
						onClickSubmitComment 	= { this.onClickSubmitComment }
						checkComments 			= { this.checkComments }
						onAction				= { this.onAction }
						region                  = {RegionHelper.getRegion(this.getMoreartyContext().getBinding())}
					/>
				</div>
			);
		} else if(isSync && messages.length === 0) {
			return (
				<div className="bParentalConsentTab">
					<div
						className="eParentalConsentTab_info"
					>
						There are no messages to display.
					</div>
				</div>
			);
		}
	}
});

module.exports = ParentalConsentTab;