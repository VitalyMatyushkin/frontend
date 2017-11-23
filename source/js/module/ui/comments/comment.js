const	React			= require('react'),
		{DateHelper}		= require('../../helpers/date_helper'),
		CommentAvatar	= require('./comment_avatar'),
		CommentStyle	= require('../../../../styles/ui/comments/b_comment.scss');

const Comment = React.createClass({
	propTypes: {
		comment:			React.PropTypes.object.isRequired,
		onReply:			React.PropTypes.func.isRequired,
		onRemove:			React.PropTypes.func.isRequired,
		isShowRemoveLink:	React.PropTypes.bool.isRequired
	},
	getUserName: function(user) {
		return `${user.firstName} ${user.lastName}`;
	},
	isShowCommentAvatar: function() {
		return typeof this.props.comment.author.avatar !== "undefined";
	},
	isShowReplyToBlock: function() {
		return typeof this.props.comment.replyToUser !== "undefined";
	},
	onReply: function () {
		this.props.onReply(this.props.comment);
	},
	onRemove: function () {
		this.props.onRemove(this.props.comment);
	},
	renderCommentAvatar: function() {
		let result = null;

		if(this.isShowCommentAvatar()) {
			result = (
				<CommentAvatar avatar={this.props.comment.author.avatar}/>
			);
		}

		return result;
	},
	renderReplyToBlock: function() {
		let result = null;

		if(this.isShowReplyToBlock()) {
			result = (
				<span className="eComment_usernameReply">
				{this.getUserName(this.props.comment.replyToUser)}
			</span>
			);
		}

		return result;
	},
	renderRemoveLink: function () {
		if(this.props.isShowRemoveLink) {
			return (
				<a
					className	= "eComment_reply"
					onClick		= { this.onRemove }
				>
					Remove
				</a>
			);
		} else {
			return null;
		}
	},
	render: function() {
		return (
			<div className="bComment">
				{this.renderCommentAvatar()}
				<div className="eComment_messageBox">
					<span className="eComment_username">
						{this.getUserName(this.props.comment.author)}
					</span>
					{this.renderReplyToBlock()}
					<span className="eComment_message">
						{this.props.comment.text}
					</span>
					<div>
						<a	className	= "eComment_reply"
							onClick		= { this.onReply }
						>
							Reply
						</a>
						{ this.renderRemoveLink() }
						<span className="eComment_commentDate">
							{DateHelper.getDateTimeString(this.props.comment.createdAt)}
						</span>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = Comment;