/**
 * Created by bridark on 16/06/15.
 */
const   CommentBox      = require('./event_blogBox'),
        React           = require('react'),
        ReactDOM        = require('reactDom'),
        Immutable       = require('immutable'),
        MoreartyHelper  = require('module/helpers/morearty_helper'),
        convertPostIdToInt = function(comment){
            comment.postId = parseInt(comment.postId, 10);
            return comment;
        };

let topLevelComments    = [],
    childComments       = [];

const Blog = React.createClass({
    mixins:[Morearty.Mixin],
    // ID of current school
    // Will set on componentWillMount event
    activeSchoolId: undefined,
    loggedUser: undefined,
    getInitialState:function(){
        return {blogUpdate:{}}
    },
    _setBlogCount:function(){
        const   self    = this,
                binding = self.getDefaultBinding();

        window.Server.schoolEventCommentsCount.get({schoolId: self.activeSchoolId, eventId: binding.get('eventId')})
            .then(res => {
                binding.set('blogCount', res.count);
                return res;
            });
    },
	/**
     * Get all comments for event from server
     * @private
     */
    _setComments: function() {
        const   self    = this,
                binding = self.getDefaultBinding();

        window.Server.schoolEventComments.get(
            {
                schoolId:   self.activeSchoolId,
                eventId:    binding.get('eventId')
            }
        ).then(function(blogs){
            Promise.all(
                blogs.map(blog =>
                    window.Server.user.get({
                        schoolId:   self.activeSchoolId,
                        userId:     blog.authorId
                    })
                    .then(user => blog.author = user)
                )
            )
            .then(_ => {
                binding
                    .atomically()
                    .set('blogs',       Immutable.fromJS(blogs))
                    .set('blogCount',   Immutable.fromJS(blogs.length))
                    .commit();
            });
        });
    },
    componentWillMount:function(){
        const self = this;

        self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

        self._setLoggedUser();

        // upload all comments from server
        self._setComments();

        //TODO WTF?!
        //For permissions
        //window.Server.userChildren.get({id:loggedUser}).then(function(children){
        //        var participants = binding.get('players').toJS();
        //    if(participants !== undefined && participants.length >=1){
        //        var childrenId = children.map(function(child){
        //            return child.id;
        //        });
        //        participants.forEach(function(part){
        //            if(part !== undefined){
        //                for(var i=0; i<part.length; i++){
        //                    for(var x=0; x <childrenId.length; x++){
        //                        if(part[i].id === childrenId[x]){self.hasChild = true; break;}
        //                    }
        //                }
        //            }
        //        });
        //    }
        //    return children;
        //});
        //End of
        self._fetchCommentsData();
    },
    _setLoggedUser: function() {
        const   self            = this,
                loggedUserId    = self.getMoreartyContext().getBinding().get('userData.authorizationInfo.userId');

        window.Server.user.get({
                schoolId:   self.activeSchoolId,
                userId:     loggedUserId
            })
            .then(user => self.loggedUser = user)
    },
    _fetchCommentsData:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            eventId = binding.get('eventId');
        // TODO implement after available on server
        //window.Server.addToBlog.get({id:eventId,filter:{order:'postId ASC'}})
        //    .then(function(comments){
        //        comments.forEach(function(comment){
        //            window.Server.user.get({id:comment.ownerId})
        //                .then(function(author){
        //                    comment.commentor = author;
        //                    if(comment.parentId === '1'){
        //                        topLevelComments.push(comment)
        //                    }else{
        //                        childComments.push(comment);
        //                    }
        //                    topLevelComments.forEach(function(topLevelComment){
        //                        if(childComments.length > 0){
        //                            topLevelComment.replies = childComments.filter(function(child){
        //                                return child.parentId === topLevelComment.id;
        //                            });
        //                            if(topLevelComment.replies.length >= 1){
        //                                topLevelComment.replies = topLevelComment.replies.map(convertPostIdToInt);
        //                                topLevelComment.replies.sort(function (a, b) {
        //                                    return a.postId - b.postId;
        //                                });
        //                            }
        //                        }
        //                    });
        //                    topLevelComments = topLevelComments.map(convertPostIdToInt);
        //                    topLevelComments.sort(function(a, b){
        //                        return a.postId - b.postId;
        //                    });
        //                    binding.set('blogs',Immutable.fromJS(topLevelComments));
        //                    binding.set('filteredChild',Immutable.fromJS(childComments));
        //                    ReactDOM.findDOMNode(self.refs.newComment).style.display = 'none';
        //                    return author;
        //                });
        //        });
        //        self._setBlogCount();
        //        return comments;
        //    });
    },
    // TODO HMMMMM???
    componentDidMount:function(){
        var self = this,
            binding = self.getDefaultBinding();

        self._tickerForNewComments();
    },
    _tickerForNewComments:function(){
        var self = this,
            binding = self.getDefaultBinding();

        self.intervalId = setInterval(function () {
            window.Server.schoolEventCommentsCount.get({schoolId: self.activeSchoolId, eventId: binding.get('eventId')}).then(function(res){
                var oldCount = binding.get('blogCount');
                if(oldCount && oldCount !== res.count) {
                    self._setComments();
                }
                return res;
            });
        }, 10000);
    },
    componentWillUnmount:function(){
        var self = this,
            binding = self.getDefaultBinding();
        binding.remove('blogs');
        topLevelComments.length = 0;
        childComments.length = 0;
        clearInterval(self.intervalId);
    },
    _commentButtonClick:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            eventId = binding.get('eventId'),
            comments = ReactDOM.findDOMNode(self.refs.commentBox).value;

        ReactDOM.findDOMNode(self.refs.commentBox).value = "";

        return window.Server.schoolEventComments.post(
            {
                schoolId: self.activeSchoolId,
                eventId: binding.get('eventId')
            },
            {
                text: comments
            }
        )
        .then(function(comment){
            const   blogs       = binding.toJS('blogs'),
                    blogCount   = binding.toJS('blogCount');

            comment.author = self.loggedUser;
            blogs.push(comment);

            binding
                .atomically()
                .set('blogCount', Immutable.fromJS(blogCount + 1))
                .set('blogs', Immutable.fromJS(blogs))
                .commit();
        });
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            dataBlog = binding.toJS('blogs') !== undefined ? binding.toJS('blogs') : undefined;
        return(
            <div className="bBlogMain">
                <div className="bEventHeader">
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