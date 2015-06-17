/**
 * Created by bridark on 16/06/15.
 */
var If = require('module/ui/if/if'),
    Blog;
Blog = React.createClass({
    mixins:[Morearty.Mixin],
    getInitialState:function(){
        return {blogUpdate:{}}
    },
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding();
        self._fetchCommentsData();
    },
    _fetchCommentsData:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            eventId = binding.get('eventId');
        window.Server.addToBlog.get({id:eventId, filter:{where:{parentId:1}}})
            .then(function(res){
                var blogData = [];
                res.forEach(function(blogItem, index){
                    window.Server.user.get({id:blogItem.ownerId})
                        .then(function(user){
                            blogItem.commentor = user;
                            //Get blogs that have same parentId as current blog id
                            window.Server.addToBlog.get({id:eventId, filter:{where:{parentId:blogItem.id}}})
                                .then(function(children){
                                    children.forEach(function(childBlog){
                                        window.Server.user.get({id:childBlog.ownerId})
                                            .then(function(childUser){
                                                childBlog.commentor = childUser;
                                            })
                                    });
                                    blogItem.replies = children; blogData.push(blogItem); console.log(blogData);
                                    binding.set('blogs',blogData);
                                });
                        }
                    );
                })
            });
    },
    componentDidMount:function(){
        var self = this,
            binding = self.getDefaultBinding();
        //self.timerId = setInterval(self.populateBlog,1000);
        setTimeout(self.populateBlog,10000);
    },
    componentWillUnmount:function(){
        var self = this,
            binding = self.getDefaultBinding();
        clearInterval(self.timerId);
        binding.clear('blogs');
    },
    populateBlog: function () {
        var self = this,
            tmpBlog;
            binding = self.getDefaultBinding();
         tmpBlog = self._updateCommentsArea(binding.get('blogs'));
        self.setState({blogUpdate:tmpBlog});
    },
    _commentButtonClick:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding(),
            eventId = binding.get('eventId'),
            comments = React.findDOMNode(self.refs.commentBox).value,
            bloggerId = globalBinding.get('userData.authorizationInfo.userId');
        window.Server.addToBlog.post({id:eventId},
            {
                eventId:eventId,
                ownerId:bloggerId,
                parentId:1,
                message:comments,
                hidden:false
            })
            .then(function(result){
                window.Server.addToBlog.get({id:eventId})
                    .then(function(res){
                        var blogData = [];
                        res.forEach(function(blogItem, index){
                            window.Server.user.get({id:blogItem.ownerId})
                                .then(function(user){
                                    blogItem.commentor = user; blogData.push(blogItem);
                                    binding.set('blogs',blogData);
                                }
                            );
                        })
                    });
            });
        React.findDOMNode(self.refs.commentBox).value="";
    },
    _textAreaChange:function(){
        var self = this;
        console.log(React.findDOMNode(self.refs.commentBox).value);
    },
    _updateCommentsArea:function(data){
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding(),
            parentEl,
            replyButtonClick = function(blogVal){
                //parentEl = document.getElementById(blogVal);
                //if(parentEl.style.display === 'block'){
                //    parentEl.style.display = 'none';
                //}else{
                //    parentEl.style.display = 'block';
                //}
                cancel(blogVal);
            },
            cancel = function(elId){
                var el = document.getElementById(elId);
                el.style.display === "block" ? el.style.display = "none": el.style.display = "block";
            },
            replyToButtonClick = function(blogVal){
                var  eventId = binding.get('eventId'),
                    reply = document.getElementById(blogVal).children[0].value,
                    bloggerId = globalBinding.get('userData.authorizationInfo.userId');
                window.Server.addToBlog.post({id:eventId},
                    {
                        eventId:eventId,
                        ownerId:bloggerId,
                        message:reply,
                        parentId: blogVal,
                        hidden:false
                    })
                    .then(function(result){
                        console.log(result);
                        document.getElementById(blogVal).children[0].value = "";
                        document.getElementById(blogVal).style.display = "none";
                        self._fetchCommentsData();
                    });
            },
            replyToReplyButtonClick=function(blogVal, parentBlogVal){
                var  eventId = binding.get('eventId'),
                    reply = document.getElementById(blogVal).children[0].value,
                    bloggerId = globalBinding.get('userData.authorizationInfo.userId');
                window.Server.addToBlog.post({id:eventId},
                    {
                        eventId:eventId,
                        ownerId:bloggerId,
                        message:reply,
                        parentId: parentBlogVal,
                        hidden:false
                    })
                    .then(function(result){
                        console.log(result);
                        document.getElementById(blogVal).children[0].value = "";
                        document.getElementById(blogVal).style.display = "none";
                        self._fetchCommentsData();
                    });
            },
            mappedData;
        if(typeof data !== 'undefined' && data != null){
            mappedData = data.map(function(blog,index){
                var replies;
                if(typeof blog.replies !== 'undefined' && blog.replies.length >=1){
                    replies = blog.replies.map(function(reply){
                        return (
                            <div className="bBlog_box_reply">
                                <div className="bBlog_picBox_reply">
                            <span className="bBlog_pic_reply">
                                <img src={typeof reply.commentor !== 'undefined'? reply.commentor.avatar : 'http://placehold.it/400x400'}/>
                            </span>
                                </div>
                                <div className="bBlog_messageBox_reply">
                            <span className="bBlog_username_reply">
                                {typeof reply.commentor !== 'undefined'? reply.commentor.username:""}
                            </span>
                            <span className="bBlog_message_reply">
                                {typeof reply.commentor !== 'undefined'? reply.message:""}
                            </span>
                            <span onClick={replyButtonClick.bind(null,reply.id)} className="bLinkLike bBlog_replyButton_reply">
                                Reply
                            </span>
                                    <div id={reply.id} style={{display:'none'}}>
                                        <Morearty.DOM.textarea  className="eEvent_comment eEvent_commentBlog eBlog_replyTextArea"/>
                                        <span onClick={replyToReplyButtonClick.bind(null,reply.id, blog.id)} className="bButton bReplyButton">Reply</span>
                                        <span onClick={cancel.bind(null,reply.id)} className="bButton bReplyButton cancel">Cancel</span>
                                    </div>
                                </div>
                            </div>
                        )
                    });
                }
                return(
                    <div className="bBlog_box">
                        <div className="bBlog_parent_comment">
                            <div className="bBlog_picBox">
                            <span className="bBlog_pic">
                                <img src={blog.commentor.avatar}/>
                            </span>
                            </div>
                            <div className="bBlog_messageBox">
                            <span className="bBlog_username">
                                {blog.commentor.username}
                                <span className="bBlog_timestamp">1 month ago</span>
                            </span>
                            <span className="bBlog_message">
                                {blog.message}
                            </span>
                            <span onClick={replyButtonClick.bind(null,blog.id)} className="bLinkLike bBlog_replyButton">
                                Reply
                            </span>
                                <div id={blog.id} className="bBlog_textArea_container">
                                    <Morearty.DOM.textarea  className="eEvent_comment eEvent_commentBlog eBlog_replyTextArea"/>
                                    <span onClick={replyToButtonClick.bind(null,blog.id)} className="bButton bReplyButton">Reply</span>
                                    <span onClick={cancel.bind(null,blog.id)} className="bButton bReplyButton cancel">Cancel</span>
                                </div>
                            </div>
                        </div>
                        {replies}
                    </div>
                )
            });
        }
        return mappedData;
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding();
        return(
            <div style={{position:'relative'}}>
                <div className="bEventHeader">
                    <div className="eEventHeader_field mDate">Comments</div>
                    <div className="eEventHeader_field mName">Comments / Blog Section</div>
                    <div className="eEventHeader_field mSport">{binding.get('sport.name') + ' (' + binding.get('model.type') + ')'}</div>
                </div>
                <div className="eEvent_commentText eEvent_blog">
                    {self.state.blogUpdate}
                </div>
                <div>
                    <Morearty.DOM.textarea ref="commentBox" className="eEvent_comment eEvent_commentBlog"/>
                </div>
                <div>
                    <div onClick={self._commentButtonClick.bind(null)} className="bButton">Comment</div>
                </div>
            </div>
        )
    }
});
module.exports = Blog;