const	React	= require('react'),
		Comment	= require('./comment');

const CommentList = React.createClass({
	propTypes: {
		comments:	React.PropTypes.array,
		onReply:	React.PropTypes.func.isRequired
	},
	renderBlogComments: function(comments) {
		let result = null;
		
		if(typeof comments !== 'undefined') {
			result = comments.map(comment => <Comment key={comment.id} comment={comment} onReply={this.props.onReply}/>);
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