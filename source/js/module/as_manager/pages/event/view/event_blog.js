/**
 * Created by bridark on 16/06/15.
 */
const   CommentBox      = require('./event_blogBox'),
        React           = require('react'),
        ReactDOM        = require('reactDom'),
        Immutable       = require('immutable'),
        MoreartyHelper  = require('module/helpers/morearty_helper');

const Blog = React.createClass({
    mixins:[Morearty.Mixin],
    // ID of current school
    // Will set on componentWillMount event
    activeSchoolId: undefined,
    loggedUser: undefined,
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
            },
            {
                filter: {
                    limit: 100
                }
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
        }, 15000);
    },
    componentWillUnmount:function(){
        var self = this,
            binding = self.getDefaultBinding();
        binding.remove('blogs');
        clearInterval(self.intervalId);
    },
    _commentButtonClick:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            eventId = binding.get('eventId'),
            comments = ReactDOM.findDOMNode(self.refs.commentBox).value,
			replyTo = binding.get('replyTo'),
			replyName = replyTo ? `${replyTo.lastName} ${replyTo.firstName}` : null,
			postData = {text: comments};

        ReactDOM.findDOMNode(self.refs.commentBox).value = "";
		binding.sub('replyTo').clear();

		/**if reply and a comment contains the name*/
		if(replyTo && comments.indexOf(replyName) >= 0){
			postData.text = comments.replace(replyName, '').trim(); // remove reply name from comment
			postData.replyTo = replyTo.id;// set replyId in postData
		}

        return window.Server.schoolEventComments.post(
            {
                schoolId: self.activeSchoolId,
                eventId: binding.get('eventId')
            },
			postData
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
	onReply:function(blog){
		var self = this,
			binding = self.getDefaultBinding();
		binding.set('replyTo', blog.author);

		ReactDOM.findDOMNode(self.refs.commentBox).value = `${blog.author.lastName} ${blog.author.firstName} `;
	},
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            dataBlog = binding.toJS('blogs');
        return(
            <div className="bBlogMain">
                <CommentBox onReply={self.onReply} blogData={dataBlog} />
                <div>
                    <Morearty.DOM.textarea ref="commentBox" placeholder="Enter your comment" className="eEvent_comment eEvent_commentBlog"/>
                </div>
                <div className="bEventButtons">
                    <div onClick={self._commentButtonClick.bind(null,this)} className="bEventButton">Send</div>
                </div>
            </div>
        )
    }
});
module.exports = Blog;