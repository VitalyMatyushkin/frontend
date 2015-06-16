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
            binding = self.getDefaultBinding(),
            eventId = binding.get('eventId');
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
    },
    componentDidMount:function(){
        var self = this,
            binding = self.getDefaultBinding();
        self.timerId = setInterval(self.populateBlog,1000);
    },
    componentWillUnmount:function(){
        var self = this;
        clearInterval(self.timerId);
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
            replyButtonClick = function(blogVal){
                //console.log('clicked '+blogVal);
                console.log(document.getElementById(blogVal).children[0]);
                var parentEl = document.getElementById(blogVal);
                if(parentEl.style.display === 'block'){
                    parentEl.style.display = 'none';
                }else{
                    parentEl.style.display = 'block';
                }
            },
            mappedData;
        if(typeof data !== 'undefined'){
            mappedData = data.map(function(blog){
                return(
                    <div className="bBlog_box">
                        <div className="bBlog_picBox">
                            <span className="bBlog_pic">
                                <img src={blog.commentor.avatar}/>
                            </span>
                        </div>
                        <div className="bBlog_messageBox">
                            <span className="bBlog_username">
                                {blog.commentor.username}
                            </span>
                            <span className="bBlog_message">
                                {blog.message}
                            </span>
                            <span onClick={replyButtonClick.bind(null,blog.id)} className="bLinkLike bBlog_replyButton">
                                Reply
                            </span>
                            <div id={blog.id} style={{display:'none'}}>
                                <Morearty.DOM.textarea  className="eEvent_comment eEvent_commentBlog eBlog_replyTextArea"/>
                                <span className="bButton bReplyButton">Reply</span>
                            </div>
                        </div>
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
            <div>
                <div className="bEventHeader">
                    <div className="eEventHeader_field mDate">Comments</div>
                    <div className="eEventHeader_field mName">Comments / Blog Section</div>
                    <div className="eEventHeader_field mSport">{binding.get('sport.name') + ' (' + binding.get('model.type') + ')'}</div>
                </div>
                <div className="eEvent_commentText">
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