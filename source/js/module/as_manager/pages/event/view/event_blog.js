/**
 * Created by bridark on 16/06/15.
 */
var If = require('module/ui/if/if'),
    filteredBag = [],
    filteredChild = [],
    CommentBox = require('./event_blogBox'),
    Blog;
Blog = React.createClass({
    mixins:[Morearty.Mixin],
    getInitialState:function(){
        return {blogUpdate:{}}
    },
    _setBlogCount:function(){
        var self = this,
          binding = self.getDefaultBinding();
        window.Server.getCommentCount.get({id:binding.get('eventId')}).then(function(res){
            binding.set('blogCount', res.count);
        });
    },
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding(),
            loggedUser = globalBinding.get('userData.authorizationInfo.userId');
        self.hasChild = false;
        //For permissions
        window.Server.userChildren.get({id:loggedUser}).then(function(children){
                var participants = binding.get('players').toJS();
            if(participants !== undefined && participants.length >=1){
                var childrenId = children.map(function(child){
                    return child.id;
                });
                participants.forEach(function(part){
                    if(part !== undefined){
                        for(var i=0; i<part.length; i++){
                            for(var x=0; x <childrenId.length; x++){
                                if(part[i].id === childrenId[x]){self.hasChild = true; break;}
                            }
                        }
                    }
                });
            }
        });
        //End of
        self._fetchCommentsData();
    },
    //
    _fetchCommentsData:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            eventId = binding.get('eventId');
        window.Server.addToBlog.get({id:eventId,filter:{order:'postId ASC'}})
            .then(function(comments){
                comments.forEach(function(comment){
                    window.Server.user.get({id:comment.ownerId})
                        .then(function(author){
                            comment.commentor = author;
                            if(comment.parentId == 1){filteredBag.push(comment)}else{filteredChild.push(comment)}
                            filteredBag.forEach(function(par,index){
                                if(filteredChild !== undefined){
                                    par.replies = filteredChild.filter(function(child){
                                        return child.parentId === par.id;
                                    });
                                    if(par.replies.length >=1){
                                        par.replies.sort(function (a,b) {
                                            return a.postId - b.postId;
                                        });
                                        filteredBag[index] = par;
                                    }
                                    filteredBag.sort(function(a,b){return a.postId - b.postId});
                                    binding.set('blogs',Immutable.fromJS(filteredBag));
                                    binding.set('filteredChild',Immutable.fromJS(filteredChild));
                                    React.findDOMNode(self.refs.newComment).style.display = 'none';
                                }
                            })
                        });
                });
                self._setBlogCount();
            });
    },
    componentDidMount:function(){
        var self = this,
            binding = self.getDefaultBinding();
        self._tickerForNewComments();
    },
    _tickerForNewComments:function(){
        var self = this,
            binding = self.getDefaultBinding();
        self.intervalId = setInterval(function () {
            window.Server.getCommentCount.get({id:binding.get('eventId')}).then(function(res){
                var oldCount = binding.get('blogCount');
                if(oldCount !== undefined){
                    if(oldCount !== res.count){
                        React.findDOMNode(self.refs.newComment).style.display = 'block';
                        binding.set('blogCount',res.count);
                        filteredBag.length = 0;
                        filteredChild.length = 0;
                        self._fetchCommentsData();
                    }
                }
                //clearInterval(self.intervalId);
            });
        },1000);
    },
    componentWillUnmount:function(){
        var self = this,
            binding = self.getDefaultBinding();
        binding.remove('blogs');
        filteredBag.length = 0;
        filteredChild.length = 0;
    },
    _commentButtonClick:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding(),
            eventId = binding.get('eventId'),
            comments = React.findDOMNode(self.refs.commentBox).value,
            bloggerId = globalBinding.get('userData.authorizationInfo.userId');
        if(self.hasChild || bloggerId !== undefined){
            window.Server.addToBlog.post({id:eventId},
                {
                    eventId:eventId,
                    ownerId:bloggerId,
                    parentId:1,
                    postId:binding.get('blogCount')+1,
                    message:comments,
                    hidden:false
                })
                .then(function(result){
                    window.Server.user.get({id:result.ownerId})
                        .then(function(author){
                            result.commentor = author;
                            filteredBag.push(result);
                            binding.set('blogs',Immutable.fromJS(filteredBag));
                        });
                    self._setBlogCount();
                });
            React.findDOMNode(self.refs.commentBox).value="";
        }else{
            alert("You cannot comment on this forum");
        }
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            dataBlog = binding.toJS('blogs') !== undefined ? binding.toJS('blogs') : undefined;
        return(
            <div className="bBlogMain">
                <div className="bEventHeader">
                    <div className="eEventHeader_field mDate">Comments</div>
                    <div className="eEventHeader_field mName">Comments / Blog Section</div>
                    <div className="eEventHeader_field mSport">{binding.get('sport.name') + ' (' + binding.get('model.type') + ')'}</div>
                </div>
                <div ref="newComment" className="eComment_notification">
                    New Comment added
                </div>
                <CommentBox currentUserHasChild={self.hasChild} blogData={dataBlog} binding={binding} />
                <div>
                    <Morearty.DOM.textarea ref="commentBox" className="eEvent_comment eEvent_commentBlog"/>
                </div>
                <div>
                    <div onClick={self._commentButtonClick.bind(null,this)} className="bButton">Comment</div>
                </div>
            </div>
        )
    }
});
module.exports = Blog;