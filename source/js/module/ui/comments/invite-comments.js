const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),
		InviteCommentsView	= require('./invite-comments-view'),
		NewCommentForm		= require('./comments');

const InviteComments = React.createClass({
	mixins:[Morearty.Mixin],
	propTypes:{
		inviteId				: React.PropTypes.string.isRequired,
		activeSchoolId			: React.PropTypes.string.isRequired
	},
	componentWillMount:function(){
		this.setLoggedUser();
		// upload all comments from server
		this.setComments();

		const binding = this.getDefaultBinding();
		binding.set('newCommentText', '');
	},
	/**
	 * Function start timer, which send request on server with count comment
	 * If count don't equal old count, then call function with get comments
	 */
	componentDidMount: function() {
		this.intervalId = setInterval(this.checkComments, 30000);
	},
	componentWillUnmount:function(){
		const binding = this.getDefaultBinding();

		binding.remove('inviteComments');
		clearInterval(this.intervalId);
	},
	getNewCommentText: function() {
		return this.getDefaultBinding().get('newCommentText');
	},
	setNewCommentText: function(text) {
		return this.getDefaultBinding().set('newCommentText', text);
	},
	clearNewCommentText: function() {
		this.setNewCommentText('');
	},
	/**
	 * Function add name of "reply user" to new comment text and return it.
	 * Result - "FirstName LastName, newCommentText"
	 * @param replyUser
	 * @returns {string}
	 */
	getNewCommentTextWithReplyText: function(replyUser) {
		const binding = this.getDefaultBinding();

		return `${replyUser.firstName} ${replyUser.lastName}, ${binding.get('newCommentText')}`;
	},
	checkComments: function() {
		const binding = this.getDefaultBinding();

		window.Server.schoolInviteCommentsCount.get({
				schoolId:	this.props.activeSchoolId,
				inviteId:	this.props.inviteId
			})
			.then(res => {
				const oldCount = binding.get('inviteCommentsCount');
				if(oldCount && oldCount !== res.count) {
					this.setComments();
				}
				return res;
			})
	},
	setLoggedUser: function() {
		const	binding = this.getDefaultBinding();

		window.Server.profile.get().then(user => binding.set('loggedUser', Immutable.fromJS(user)))
	},
	/**
	 * Get all comments for invite from server
	 * @private
	 */
	setComments: function() {
		const binding = this.getDefaultBinding();

		window.Server.schoolInviteComments.get(
			{
				schoolId	: this.props.activeSchoolId,
				inviteId	: this.props.inviteId
			},
			{
				filter: {
					limit: 100
				}
			}
			)
			.then(comments => {
				binding
					.atomically()
					.set('inviteComments',		Immutable.fromJS(comments))
					.set('inviteCommentsCount',	Immutable.fromJS(comments.length))
					.commit();
			});
	},
	onSubmitCommentClick: function(){
		const binding 	= this.getDefaultBinding();

		const	textComment	= this.getNewCommentText(),
				inviteId	= this.props.inviteId,
				replyTo		= binding.get('replyTo'),
				replyName	= replyTo ? `${replyTo.author.lastName} ${replyTo.author.firstName}` : null,
				postData	= {text: textComment};

		binding.sub('replyTo').clear();
		this.clearNewCommentText();

		/**if reply and a comment contains the name*/
		if(replyTo && textComment.indexOf(replyName) >= 0){
			postData.text = textComment.replace(`${replyName},`, '').trim(); // remove reply name from comment
			postData.replyToCommentId = replyTo.id; // set reply comment in postData
		}

		return window.Server.schoolInviteComments.post(
			{
				schoolId: this.props.activeSchoolId,
				inviteId: inviteId
			},
			postData
		)
			.then(comment => {
				const	comments		= binding.toJS('inviteComments'),
						commentsCount	= binding.toJS('inviteCommentsCount');

				comments.push(comment);

				binding.atomically()
					.set('inviteCommentsCount', 	Immutable.fromJS(commentsCount + 1))
					.set('inviteComments', 			Immutable.fromJS(comments))
					.commit();
			});
	},
	onReply:function(comments){
		const binding = this.getDefaultBinding();

		binding
			.atomically()
			.set('newCommentText',	this.getNewCommentTextWithReplyText(comments.author))
			.set('replyTo', 		comments)
			.commit();
	},
	onChangeNewCommentText: function(text) {
		this.setNewCommentText(text);
	},
	render:function() {
		const	binding		= this.getDefaultBinding();

		const	comments	= binding.toJS('inviteComments'),
				loggedUser	= binding.toJS('loggedUser'),
				replyTo		= binding.toJS('replyTo') ? binding.toJS('replyTo') : null;

		return (
				<div className="bInviteComments">
					<InviteCommentsView onReply={this.onReply} comments={comments} />
					<NewCommentForm	avatarPic		= {loggedUser && loggedUser.avatar}
									avatarMinValue	= {45}
									text			= {this.getNewCommentText()}
									onChangeText	= {this.onChangeNewCommentText}
									onSubmit		= {this.onSubmitCommentClick}
					/>
				</div>
		);
	}
});

module.exports = InviteComments;