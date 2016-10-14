/**
 * Created by bridark on 14/07/15.
 */
const 	React 	= require('react'),
		Avatar 	= require('module/ui/avatar/avatar'),
		If		= require('module/ui/if/if');

const CommentBox = React.createClass({
	propTypes:{
		blogData: React.PropTypes.array,
		onReply: React.PropTypes.func.isRequired
	},
	_renderBlogComments: function(blogData){
		const self = this;

		return blogData && blogData.map( blog => {
			return (
				<div key={blog.id} className="bBlog_box">
					<div className="ePicBox">
						<Avatar pic={blog.author.avatar} minValue={45} />
					</div>
					<div className="eMessageBox">
						<span className="eUsername">
							{`${blog.author.firstName} ${blog.author.lastName}`}
						</span>
						<If condition={!!(blog && blog.replyToUser)}>
							<span className="eUsernameReply">
								{`${blog.replyToUser && blog.replyToUser.firstName} ${blog.replyToUser && blog.replyToUser.lastName}`}
							</span>
						</If>
						<span className="eMessage">
							{blog.text}
						</span>
						<div>
							<a className="eReply" onClick={self.props.onReply.bind(null, blog)}>Reply</a>
							<span className="eCommentDate">{new Date(blog.createdAt).toLocaleString('en-GB')}</span>
						</div>
					</div>
				</div>
			);
		});
	},
	render: function() {
		const	self	= this,
				blogs	= self._renderBlogComments(self.props.blogData);

		return (
			<div className="eEvent_commentText eEvent_blog">{blogs}</div>
		);
	}
});

module.exports = CommentBox;