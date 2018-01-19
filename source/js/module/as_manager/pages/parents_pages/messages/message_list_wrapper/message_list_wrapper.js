const	React		= require('react'),
		Morearty	= require('morearty'),
		Immutable	= require('immutable');

const	Lazy		= require('lazy.js');

const	MessageList		= require('module/ui/message_list/message_list');

const MessageListWrapper = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		messageType:	React.PropTypes.string.isRequired,
		actions:		React.PropTypes.object.isRequired,
		userType:		React.PropTypes.string.isRequired
	},
	componentWillMount: function() {
		//load user->load messages->load templates
		const binding = this.getDefaultBinding();

		this.props.actions.setSync(binding, false);
		this.props.actions.getLoggedUser()
			.then(user => {
				binding.set('loggedUser', Immutable.fromJS(user));

				return this.props.actions.setConsentRequestTemplates(
					binding,
					this.props.userType
				);
			})
			.then(() => this.props.actions.setSync(binding, true));
	},
	getTemplatesFromBinding: function(binding) {
		return binding.toJS('template');
	},
	triggerMsgCountUpdater: function () {
		this.getMoreartyContext().getBinding().set('isMessagesCountNeedUpdate', true);
	},
	onAction: function (messageId, messageKind, actionType, templateData) {
		this.props.actions.onAction(
			this.getDefaultBinding(),
			this.props.userType,
			this.props.messageType,
			messageId,
			messageKind,
			actionType,
			templateData
		).then(() => this.triggerMsgCountUpdater());
	},
	onClickShowComments: function(messageId){
		this.props.actions.onClickShowComments(
			this.getDefaultBinding(),
			this.props.userType,
			messageId
		);
	},
	onClickSubmitComment: function(newCommentText, replyComment, messageId){
		this.props.actions.onClickSubmitComment(
			this.getDefaultBinding(),
			this.props.userType,
			newCommentText,
			replyComment,
			messageId
		);
	},
	checkComments: function(messageId){
		this.props.actions.checkComments(
			this.getDefaultBinding(),
			this.props.userType,
			messageId
		);
	},
	render: function() {
		let content = null;

		const binding = this.getDefaultBinding();

		if( Boolean(binding.toJS('isSync')) ) {
			const templates = this.getTemplatesFromBinding(binding);

			content = (
				<MessageList
					key						= { binding.toJS('messagesListKey') }
					loadMessages			= { page =>
						this.props.actions.loadMessagesByPage(page, this.props.userType, this.props.messageType)
					}
					messageType				= { this.props.messageType }
					onAction				= { this.onAction }
					user					= { binding.toJS('loggedUser') }
					onClickShowComments		= { this.onClickShowComments }
					onClickSubmitComment	= { this.onClickSubmitComment }
					checkComments			= { this.checkComments }
					templates				= { templates }
				/>
			);
		}

		return content;
	}
});

module.exports = MessageListWrapper;