/**
 * Created by bridark on 16/06/15.
 */
var If = require('module/ui/if/if'),
    filteredBag = [],
    filteredChild = [],
    Blog;
Blog = React.createClass({
    mixins:[Morearty.Mixin],
    getInitialState:function(){
        return {blogUpdate:{}}
    },
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding(),
            loggedUser = globalBinding.get('userData.authorizationInfo.userId'); console.log(loggedUser);
        self.hasChild = false;
        //For permissions
        self.userPermission = {
            "preset": "",
            "principalId": "be636efc-7d5a-4094-8c9e-4f8bceae0d18",
            "principalType": "manager",
            "objectId": "",
            "objectType": "",
            "comment": "",
            "accepts": false,
            "id": "",
            "meta": {
                "created": "2015-06-01T15:37:45.951Z",
                "updated": "2015-06-01T15:37:46.566Z"
            },
            "userId": "be636efc-7d5a-4094-8c9e-4f8bceae0d18",
            "schoolId": "211403ed-8234-4d1e-906b-f191595f739f"
        }
        window.Server.userChildren.get({id:loggedUser}).then(function(children){
                var participants = binding.get('players').toJS();
            if(typeof participants !== 'undefined' && participants.length >=1){
                var childrenId = children.map(function(child){
                    return child.id;
                });
                participants.forEach(function(part){
                    if(typeof part !== 'undefined'){
                        for(var i=0; i<part.length; i++){
                            for(var x=0; x <childrenId.length; x++){
                                if(part[i].id === childrenId[x]){console.log('yes'); self.hasChild = true; break;}
                            }
                        }
                    };
                });
            }
        });
        //End of
        self._fetchCommentsData();
    },
    _fetchCommentsData:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            commentsBag = [],
            eventId = binding.get('eventId');
        window.Server.addToBlog.get({id:eventId})
            .then(function(comments){
                comments.forEach(function(comment){
                    window.Server.user.get({id:comment.ownerId})
                        .then(function(author){
                            comment.commentor = author;
                            commentsBag.push(comment);
                            if(comment.parentId == 1){filteredBag.push(comment)}else{filteredChild.push(comment)}
                            filteredBag.forEach(function(par,index){
                                if(typeof filteredChild !== 'undefined'){
                                    par.replies = filteredChild.filter(function(child){
                                        return child.parentId === par.id;
                                    });
                                    if(par.replies.length >=1)filteredBag[index] = par;
                                    binding.set('blogs',filteredBag);
                                }
                            })
                        });
                });
            });
    },
    componentDidMount:function(){
        var self = this,
            binding = self.getDefaultBinding();
        //self.timerId = setInterval(self.populateBlog(),1000);
        self.timerId = setTimeout(self.populateBlog,3000);
    },
    componentWillUnmount:function(){
        var self = this,
            binding = self.getDefaultBinding();
        //clearInterval(self.timerId);
        clearTimeout(self.timerId);
        binding.remove('blogs');
        filteredBag.length = 0;
        filteredChild.length = 0;
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
        if(self.hasChild || self.userPermission.userId === bloggerId){
            window.Server.addToBlog.post({id:eventId},
                {
                    eventId:eventId,
                    ownerId:bloggerId,
                    parentId:1,
                    message:comments,
                    hidden:false
                })
                .then(function(result){
                    window.Server.user.get({id:result.ownerId})
                        .then(function(author){
                            result.commentor = author;
                            filteredBag.push(result);
                            binding.set('blogs',filteredBag);
                            var tmpBlog = self._updateCommentsArea(binding.get('blogs'));
                            self.setState({blogUpdate:tmpBlog});
                        });
                });
            React.findDOMNode(self.refs.commentBox).value="";
        }else{
            alert("You cannot comment on this forum");
        }
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
                cancel(blogVal);
            },
            cancel = function(elId){
                var el = document.getElementById(elId);
                el.children[0].value = "";
                el.style.display === "block" ? el.style.display = "none": el.style.display = "block";
            },
            replyToButtonClick = function(blogVal){
                var  eventId = binding.get('eventId'),
                    reply = document.getElementById(blogVal).children[0].value,
                    bloggerId = globalBinding.get('userData.authorizationInfo.userId');
                if(self.hasChild || self.userPermission.userId === bloggerId){
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
                            window.Server.user.get({id:result.ownerId})
                                .then(function(author){
                                    result.commentor = author;
                                    filteredChild.push(result);
                                    filteredBag.forEach(function(par,index){
                                        par.replies = filteredChild.filter(function(child){
                                            return child.parentId === par.id;
                                        });
                                        filteredBag[index]=par;
                                    });
                                    binding.set('blogs',filteredBag);
                                    var tmpBlog = self._updateCommentsArea(binding.get('blogs'));
                                    self.setState({blogUpdate:tmpBlog});
                                });
                        });
                }
                else{
                    alert("You don't have permission to post here please sign up or sign in");
                }
            },
            replyToReplyButtonClick=function(blogVal, parentBlogVal){
                var  eventId = binding.get('eventId'),
                    reply = document.getElementById(blogVal).children[0].value,
                    bloggerId = globalBinding.get('userData.authorizationInfo.userId');
                if(self.hasChild || self.userPermission.userId === bloggerId){
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
                            window.Server.user.get({id:result.ownerId})
                                .then(function(author){
                                    result.commentor = author;
                                    filteredChild.push(result);
                                    filteredBag.forEach(function(par,index){
                                        par.replies = filteredChild.filter(function(child){
                                            return child.parentId === par.id;
                                        });
                                        filteredBag[index]=par;
                                    });
                                    binding.set('blogs',filteredBag);
                                    var tmpBlog = self._updateCommentsArea(binding.get('blogs'));
                                    self.setState({blogUpdate:tmpBlog});
                                });
                        });
                }else{
                    alert("You don't have permission to post here please sign up or sign in");
                }
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
                                <span className="bBlog_timestamp"></span>
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