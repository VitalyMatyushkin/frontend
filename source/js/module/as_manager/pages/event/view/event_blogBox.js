/**
 * Created by bridark on 14/07/15.
 */
const React = require('react');

const CommentBox = React.createClass({
	mixins:[Morearty.Mixin],
	propTypes:{
		blogData: React.PropTypes.array,
		currentUserHasChild: React.PropTypes.bool
	},
	_renderBlogComments: function(blogData){
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
								<span className="bBlog_timestamp"></span>
							</span>
							<span className="bBlog_message">
								{blog.text}
							</span>
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