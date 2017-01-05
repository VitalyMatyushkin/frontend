/**
 * Created by Woland on 27.12.2016.
 */
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
	onSubmitCommentClick: function(textComment){
		const binding 	= this.getDefaultBinding();

		const	inviteId	= this.props.inviteId,
				replyTo		= binding.get('replyTo'),
				replyName	= replyTo ? `${replyTo.author.lastName} ${replyTo.author.firstName}` : null,
				postData	= {text: textComment};

		binding.sub('replyTo').clear();

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
		binding.set('replyTo', comments);
	},
	render:function(){
		const	binding		= this.getDefaultBinding();

		const	comments	= binding.toJS('inviteComments'),
				loggedUser	= binding.toJS('loggedUser'),
				replyTo		= binding.toJS('replyTo') ? binding.toJS('replyTo') : null,
				commentText	= replyTo ? replyTo.author.firstName + ' ' + replyTo.author.lastName + ', ': '';

		return (
			<div className="row">
				<div className="col-md-10 col-md-offset-2">
					<div className="bInviteComments">
						<InviteCommentsView onReply={this.onReply} comments={comments} />
						<NewCommentForm	commentText		= {commentText}
										avatarMinValue	= {45}
										avatarPic		= {loggedUser && loggedUser.avatar}
										onClick			= {this.onSubmitCommentClick}
						/>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = InviteComments;