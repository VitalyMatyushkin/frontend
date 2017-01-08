const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),
		Comments		= require('../../../../ui/comments/comments');

const InviteComments = React.createClass({
	mixins:[Morearty.Mixin],
	propTypes:{
		inviteId				: React.PropTypes.string.isRequired,
		activeSchoolId			: React.PropTypes.string.isRequired
	},
	componentWillMount:function(){
		const binding = this.getDefaultBinding();

		binding.set('isSync', false);

		this.setLoggedUser()
			.then(() => {
				// upload all comments from server
				return this.setComments();
			})
			.then(() => {
				binding.set('isSync', true);

				return true;
			});
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
	checkComments: function() {
		const binding = this.getDefaultBinding();

		return window.Server.schoolInviteCommentsCount.get({
				schoolId:	this.props.activeSchoolId,
				inviteId:	this.props.inviteId
			})
			.then(res => {
				const oldCount = binding.get('inviteCommentsCount');
				if(oldCount && oldCount !== res.count) {
					this.setComments();
				}
				return true;
			})
	},
	setLoggedUser: function() {
		const	binding = this.getDefaultBinding();

		return window.Server.profile.get()
			.then(user => {
				binding.set('loggedUser', Immutable.fromJS(user));

				return true;
			});
	},
	/**
	 * Get all comments for invite from server
	 * @private
	 */
	setComments: function() {
		const binding = this.getDefaultBinding();

		return window.Server.schoolInviteComments.get(
			{
				schoolId	: this.props.activeSchoolId,
				inviteId	: this.props.inviteId
			}, {
				filter: {
					limit: 100
				}
			})
			.then(comments => {
				binding
					.atomically()
					.set('inviteComments',		Immutable.fromJS(comments))
					.set('inviteCommentsCount',	Immutable.fromJS(comments.length))
					.commit();

				return true;
			});
	},
	onSubmitComment: function(newCommentText, replyComment) {
		const binding 	= this.getDefaultBinding();

		const postData = {
			text: newCommentText
		};
		if(typeof replyComment !== 'undefined') {
			postData.replyToCommentId = replyComment.id;
		}

		return window.Server.schoolInviteComments.post(
			{
				schoolId: this.props.activeSchoolId,
				inviteId: this.props.inviteId
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
	render:function() {
		const	binding		= this.getDefaultBinding();

		const	comments	= binding.toJS('inviteComments'),
				loggedUser	= binding.toJS('loggedUser');

		if(binding.get("isSync")) {
			return (
				<Comments	user		= {loggedUser}
							 comments	= {comments}
							 onSubmit	= {this.onSubmitComment}
				/>
			);
		} else {
			return null;
		}
	}
});

module.exports = InviteComments;