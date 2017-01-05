/**
 * Created by Woland on 27.12.2016.
 */
const  React 		= require('react'),
	Avatar 			= require('module/ui/avatar/avatar'),
	If 				= require('module/ui/if/if'),
	DateHelper 		= require('module/helpers/date_helper');

const InviteCommentsView = React.createClass({
	propTypes: {
		comments: 	React.PropTypes.array,
		onReply: 	React.PropTypes.func.isRequired
	},
	handleOnClick: function(comment) {
		this.props.onReply(comment);
	},
	renderBlogComments: function(comments){

		return comments && comments.map( comment => {
				return (
					<div key={comment.id} className="bInviteCommentsView_box">
						<div className="ePicBox">
							<Avatar pic={comment.author.avatar} minValue={45} />
						</div>
						<div className="eMessageBox">
						<span className="eUsername">
							{`${comment.author.firstName} ${comment.author.lastName}`}
						</span>
							<If condition={!!(comment && comment.replyToUser)}>
							<span className="eUsernameReply">
								{`${comment.replyToUser && comment.replyToUser.firstName} ${comment.replyToUser && comment.replyToUser.lastName}`}
							</span>
							</If>
							<span className="eMessage">
							{comment.text}
						</span>
							<div>
								<a className="eReply" onClick={this.handleOnClick(comment)}>Reply</a>
								<span className="eCommentDate">{DateHelper.getDateTimeString(comment.createdAt)}</span>
							</div>
						</div>
					</div>
				);
			});
	},
	render: function() {
		const comments = this.renderBlogComments(this.props.comments);

		return (
			<div className="eEvent_commentText eEvent_blog">{comments}</div>
		);
	}
});

module.exports = InviteCommentsView;