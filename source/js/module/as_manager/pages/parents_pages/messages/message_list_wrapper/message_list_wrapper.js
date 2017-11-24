const	React		= require('react'),
		Morearty	= require('morearty'),
		Immutable	= require('immutable');

const	Lazy		= require('lazy.js');

const	MessageList	= require('module/ui/message_list/message_list'),
		Loader		= require('module/ui/loader');

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

				return this.props.actions.loadMessages(
					this.props.userType,
					this.props.messageType
				)
			})
			.then(messages => {
				const schoolIds = Lazy(messages).map(message => message.schoolId).uniq().toArray();

				binding.set('messages', Immutable.fromJS(messages));

				return this.props.actions.setConsentRequestTemplates(
					binding,
					this.props.userType,
					schoolIds
				);
			})
			.then(() => this.props.actions.setSync(binding, true));
	},
	getTemplatesFromBinding: function(binding) {
		return binding.toJS('template');
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
		);
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
		const binding = this.getDefaultBinding();
		const messages = binding.toJS('messages');
		const isSync = binding.toJS('isSync');
		const user = binding.toJS('loggedUser');

		if(!isSync) {
			return (
				<div className="eInvites_processing">
					<Loader/>
				</div>
			);
		} else if(isSync && messages.length > 0) {
			const templates = this.getTemplatesFromBinding(binding);

			return (
				<MessageList
					messages				= { messages }
					messageType				= { this.props.messageType }
					onAction				= { this.onAction }
					user					= { user }
					onClickShowComments		= { this.onClickShowComments }
					onClickSubmitComment	= { this.onClickSubmitComment }
					checkComments			= { this.checkComments }
					templates				= { templates }
				/>
			);
		} else if(isSync && messages.length === 0) {
			return (
				<div className="eInvites_processing">
					<span>
						There are no messages to display.
					</span>
				</div>
			);
		}
	}
});

module.exports = MessageListWrapper;