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
			return (
				<div key={blog.id} className="bBlog_box">
					<div className="bBlog_parent_comment">
						<div className="bBlog_picBox">
							<span className="bBlog_pic">
								<img src={'http://placehold.it/400x400'}/>
							</span>
						</div>
						<div className="bBlog_messageBox">
							<span className="bBlog_username">
								{`${blog.author.lastName} ${blog.author.firstName}`}
							</span>
							<If condition={!!(blog && blog.replyTo)}>
								<span className="bBlog_username_reply">
									{`${blog.replyTo && blog.replyTo.lastName} ${blog.replyTo && blog.replyTo.firstName}`}
								</span>
							</If>
							<span className="bBlog_message">
								{blog.text}
							</span>
							<div>
								<a className="eLike">Like</a>
								<a className="eReply" onClick={self.props.onReply.bind(null, blog)}>Reply</a>
								<span className="eCommentDate">{blog.createdAt}</span>
							</div>
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