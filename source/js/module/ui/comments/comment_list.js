const	React	= require('react'),
		Comment	= require('./comment');

const CommentList = React.createClass({
	propTypes: {
		comments:			React.PropTypes.array,
		onReply:			React.PropTypes.func.isRequired,
		onRemove:			React.PropTypes.func.isRequired,
		isShowRemoveLink:	React.PropTypes.bool.isRequired
	},
	renderBlogComments: function(comments) {
		let result = null;
		
		if(typeof comments !== 'undefined') {
			result = comments.map(comment =>
				<Comment
					key					= { comment.id }
					comment				= { comment }
					onReply				= { this.props.onReply }
					onRemove			= { this.props.onRemove }
					isShowRemoveLink	= { this.props.isShowRemoveLink }
				/>
			);
		}
		
		return result;
	},
	render: function() {
		return (
			<div className="eEvent_commentText eEvent_blog">
				{this.renderBlogComments(this.props.comments)}
			</div>
		);
	}
});

module.exports = CommentList;