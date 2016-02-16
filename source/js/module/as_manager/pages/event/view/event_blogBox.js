/**
 * Created by bridark on 14/07/15.
 */
const   BlogReplyBox    = require('./event_blogReplyBox'),
        If              = require('module/ui/if/if'),
        React           = require('react'),
        ReactDOM        = require('reactDom');


const CommentBox = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes:{
        blogData: React.PropTypes.array,
        currentUserHasChild: React.PropTypes.bool
    },
    getInitialState:function(){
        return {collapse:false};
    },
    _renderBlogComments:function(blogData){
        var self = this,
            binding = self.getDefaultBinding();
        var collapseButtonClick,
            collapseState = self.state.collapse;
        collapseButtonClick = (ref, ref2) => {
            return  (evt) => {
                if(collapseState === false){
                    ReactDOM.findDOMNode(self.refs[ref]).style.display = 'none';
                    ReactDOM.findDOMNode(self.refs[ref2]).innerText = 'Show Replies ⇣';
                    self.setState({collapse:true});
                    self.forceUpdate();
                }else{
                    ReactDOM.findDOMNode(self.refs[ref]).style.display = 'block';
                    ReactDOM.findDOMNode(self.refs[ref2]).innerText = 'Hide Replies ⇡';
                    self.setState({collapse:false});
                    self.forceUpdate();
                }
                evt.stopPropagation();
            }
        };
        if(blogData !== undefined && blogData.length >=1){
            return blogData.map(function(blog){
                var replies;
                if(blog.replies !== undefined && blog.replies.length >=1){
                    replies = blog.replies.map(function(reply){
                        return (
                            <div key={reply.id} className="bBlog_box_reply">
                                <div className="bBlog_picBox_reply">
                                    <span className="bBlog_pic_reply">
                                        <img src={reply.commentor !== undefined ? reply.commentor.avatar : 'http://placehold.it/400x400'}/>
                                    </span>
                                </div>
                                <div className="bBlog_messageBox_reply">
                                    <span className="bBlog_username_reply">
                                        {reply.commentor !== undefined ? reply.commentor.username + (reply.message.split('/')[1] !== undefined ?' @'+reply.message.split('/')[1]: '@ no one' ) :" "}
                                    </span>
                                    <span className="bBlog_message_reply">
                                        {reply.commentor !== undefined ? reply.message.split('/')[0]:" "}
                                    </span>
                                    <BlogReplyBox parentCheckBool={self.props.currentUserHasChild} binding={binding}
                                                  replyParentId={blog.id} replyParentName={reply.commentor !== undefined ? reply.commentor.username:""} />
                                </div>
                            </div>
                        );
                    });
                }
                return(
                    <div key={blog.id} className="bBlog_box">
                        <div className="bBlog_parent_comment">
                            <div className="bBlog_picBox">
                                <span className="bBlog_pic">
                                    <img src={blog.commentor.avatar}/>
                                </span>
                            </div>
                            <div className="bBlog_messageBox">
                                <span className="bBlog_username">
                                    {blog.commentor.username}
                                    <span className="bBlog_timestamp"></span>
                                </span>
                                <span className="bBlog_message">
                                    {blog.message}
                                </span>
                                <BlogReplyBox parentCheckBool={self.props.currentUserHasChild} binding={binding} replyParentId={blog.id}
                                    replyParentName = {blog.commentor.username}/>
                            </div>
                        </div>
                        <If condition={replies !== undefined}>
                            <div  onClick={collapseButtonClick(blog.id, blog.postId)} className="cCollapse">
                                <span ref={blog.postId}>{'Hide Replies '+'⇡'}</span>
                            </div>
                        </If>
                        <div ref={blog.id} className="bBlog_replyContainer">
                            {replies}
                        </div>
                    </div>
                )
            });
        }
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            blogs = self._renderBlogComments(self.props.blogData);
        return (
            <div className="eEvent_commentText eEvent_blog">{blogs}</div>
        )
    }
});
module.exports = CommentBox;