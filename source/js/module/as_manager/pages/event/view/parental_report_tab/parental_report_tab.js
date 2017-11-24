const	React					= require('react'),
		Morearty				= require('morearty'),
		Immutable				= require('immutable'),
	
		RoleHelper 				= require('module/helpers/role_helper'),
	
		MessageListActions		= require('module/as_manager/pages/messages/message_list_wrapper/message_list_actions/message_list_actions'),
		ParentalReportsTable	= require('module/as_manager/pages/event/view/parental_report_tab/parental_reports_table'),
		Loader					= require('module/ui/loader'),
	
		ParentalConsentTabStyle	= require('../../../../../../../styles/ui/b_parental_consent_tab/b_parental_consent_tab.scss');

const ParentalReportTab = React.createClass({
	mixins: [Morearty.Mixin],
	listeners: [],
	propTypes: {
		schoolId:	React.PropTypes.string.isRequired,
		eventId:	React.PropTypes.string.isRequired
	},
	componentWillMount: function() {
		const binding = this.getDefaultBinding();
		
		binding.set('isSync', false);
		
		let promises = [window.Server.profile.get()]; //common service for school staff and parent
		
		const role = RoleHelper.getLoggedInUserRole(this);
		
		if (role === 'PARENT') {
			promises = promises.concat([MessageListActions.loadParentRoleParentalReportsMessagesByEventId(this.props.eventId)]);
		} else {
			promises = promises.concat(MessageListActions.loadParentalReportsMessagesByEventId(this.props.schoolId, this.props.eventId));
		}
		
		Promise.all(promises).then(result => {
			const 	user 		= result[0],
					messages 	= result[1];
			
			binding.atomically()
				.set('messages', 	Immutable.fromJS(messages))
				.set('loggedUser', 	Immutable.fromJS(user))
				.set('isSync',		true)
				.commit();
		});
		
		this.addListeners();
	},
	componentWillUnmount: function() {
		this.listeners.forEach(listener => this.getDefaultBinding().removeListener(listener));
	},
	loadAndSetMessages: function() {
		MessageListActions.loadParentalReportsMessagesByEventId(this.props.schoolId, this.props.eventId).then(messages => {
			this.getDefaultBinding().atomically()
				.set('isSync',		true)
				.set('messages',	Immutable.fromJS(messages))
				.commit();
		});
	},
	
	addListeners: function() {
		this.listeners.push(this.getDefaultBinding().sub('isSync').addListener(descriptor => {
			const isSync = descriptor.getCurrentValue();

			if(!isSync) {
				this.loadAndSetMessages();
			}
		}));
	},
	onGotIt: function(messageId) {
		MessageListActions.gotItRefusalMessage(this.props.schoolId, messageId).then(() => this.getDefaultBinding().set('isSync', false));
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
				isSync		= binding.toJS('isSync');
		
		const 	role 		= RoleHelper.getLoggedInUserRole(this),
				user 		= binding.toJS('loggedUser');

		if(!isSync) {
			return (
				<div className="bParentalConsentTab">
					<Loader/>
				</div>
			);
		} else if(isSync && messages.length > 0) {
			return (
				<div className="bParentalConsentTab">
					<ParentalReportsTable
						messages				= { messages }
						onGotIt					= { this.onGotIt }
						onClickShowComments 	= { this.onClickShowComments }
						onClickSubmitComment 	= { this.onClickSubmitComment }
						checkComments 			= { this.checkComments }
						setComments 			= { this.setComments }
						role 					= { role }
						user 					= { user }
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

module.exports = ParentalReportTab;