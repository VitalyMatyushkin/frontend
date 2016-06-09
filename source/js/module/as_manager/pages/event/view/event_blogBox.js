/**
 * Created by bridark on 14/07/15.
 */
const 	React 	= require('react'),
		If		= require('module/ui/if/if');

const CommentBox = React.createClass({
	propTypes:{
		blogData: React.PropTypes.array,
		onReply: React.PropTypes.func.isRequired
	},
	_renderBlogComments: function(blogData){
		const self = this;

		return blogData && blogData.map( blog => {

			if(blog.replyTo && !blog.reply){
				// find reply object
				blog.reply = blogData.find(b => b.authorId === blog.replyTo).author;
			}

			return (
				<div key={blog.id} className="bBlog_box">
					<div className="ePicBox">
						<img src={blog.author.avatar}/>
					</div>
					<div className="eMessageBox">
						<span className="eUsername">
							{`${blog.author.lastName} ${blog.author.firstName}`}
						</span>
						<If condition={!!(blog && blog.replyTo)}>
							<span className="eUsernameReply">
								{`${blog.replyTo && blog.reply.lastName} ${blog.replyTo && blog.reply.firstName}`}
							</span>
						</If>
						<span className="eMessage">
							{blog.text}
						</span>
						<div>
							<span className="eCommentLike">Like</span>
							<a className="eReply" onClick={self.props.onReply.bind(null, blog)}>Reply</a>
							<span className="eCommentDate">{new Date(blog.createdAt).toLocaleString('en-GB')}</span>
						</div>
					</div>
				</div>
			);
		});
	},
	render:function(){
		const	self	= this,
				blogs	= self._renderBlogComments(self.props.blogData);

		return (
			<div className="eEvent_commentText eEvent_blog">{blogs}</div>
		)
	}
});

module.exports = CommentBox;