const	React			= require('react'),
		CommentList		= require('./comment_list'),
		NewCommentForm	= require('./new_comment_form');

const Comments = React.createClass({
	propTypes:{
		// user of this comments module
		user				: React.PropTypes.object.isRequired,
		// list of comments
		comments			: React.PropTypes.array.isRequired,
		onRemove			: React.PropTypes.func.isRequired,
		// handler for submit new comment,onRemove
		onSubmit			: React.PropTypes.func.isRequired,
		isShowRemoveLink	: React.PropTypes.bool.isRequired
	},
	getInitialState: function(){
		return {
			// text of new comment
			newCommentText: '',
			// author of new comment can reference to other comment
			// replyComment - is that comment
			replyComment: undefined,
			//flag for focus textarea
			focus : false
		};
	},
	/**
	 * Function add name of "reply user" to new comment text and return it.
	 * Result - "FirstName LastName, newCommentText"
	 * @param replyUser
	 * @returns {string}
	 */
	getNewCommentTextWithReplyText: function(replyUser) {
		return `${this.getReplyUserName(replyUser)}, ${this.state.newCommentText}`;
	},
	getReplyUserName: function(replyUser) {
		return `${replyUser.firstName} ${replyUser.lastName}`;
	},
	onSubmitCommentClick: function(){
		let		newCommentText	= this.state.newCommentText;
		const	replyComment	= this.state.replyComment;

		// prepare data
		if(typeof replyComment !== "undefined") {
			// remove reply name from comment
			newCommentText = newCommentText.replace(`${this.getReplyUserName(replyComment.author)},`, '').trim();
		}

		// clear state
		this.setState({
			newCommentText	: '',
			replyComment	: undefined,
			focus 			: false
		});

		// submit
		this.props.onSubmit(newCommentText, replyComment);
	},
	onReply: function(replyComment){
		this.setState({
			newCommentText	: this.getNewCommentTextWithReplyText(replyComment.author),
			replyComment	: replyComment,
			focus 			: true
		});
	},
	onChangeNewCommentText: function(text) {
		this.setState({
			newCommentText	: text
		});
	},
	render:function() {
		return (
				<div className="bInviteComments">
					<CommentList
						comments			= { this.props.comments }
						onReply				= { this.onReply }
						onRemove			= { this.props.onRemove }
						isShowRemoveLink	= { this.props.isShowRemoveLink }
					/>
					<NewCommentForm	avatarPic		= {this.props.user.avatar}
									text			= {this.state.newCommentText}
									onChangeText	= {this.onChangeNewCommentText}
									onSubmit		= {this.onSubmitCommentClick}
									focus 			= {this.state.focus}
					/>
				</div>
		);
	}
});

module.exports = Comments;