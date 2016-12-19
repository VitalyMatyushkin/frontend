/**
 * Created by bridark on 16/06/15.
 */
const	React		= require('react'),
		Morearty	= require('morearty'),
		Immutable	= require('immutable'),

		If			= require('../../../../ui/if/if'),
		CommentBox	= require('./event_blogBox'),
		ReactDOM	= require('react-dom'),
		Avatar		= require('module/ui/avatar/avatar');

const Blog = React.createClass({
	mixins:[Morearty.Mixin],
	propTypes:{
		eventId					: React.PropTypes.string.isRequired,
		isUserCanWriteComments	: React.PropTypes.bool.isRequired
	},
	_setBlogCount:function(){
		const   self    = this,
				binding = self.getDefaultBinding();

		window.Server.schoolEventCommentsCount.get({schoolId: this.props.activeSchoolId, eventId: this.props.eventId})
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
		const	self	= this,
				binding	= self.getDefaultBinding();

		window.Server.schoolEventComments.get(
			{
				schoolId	: this.props.activeSchoolId,
				eventId		: this.props.eventId
			},
			{
				filter: {
					limit: 100
				}
			}
		)
		.then(blogs => {
			binding
				.atomically()
				.set('blogs',		Immutable.fromJS(blogs))
				.set('blogCount',	Immutable.fromJS(blogs.length))
				.commit();
		});
	},
	componentWillMount:function(){
		const self = this;

		self._setLoggedUser();
		// upload all comments from server
		self._setComments();
	},
	_setLoggedUser: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		window.Server.profile.get().then(user => binding.set('loggedUser', Immutable.fromJS(user)))
	},
	// TODO HMMMMM???
	componentDidMount:function(){
		var self = this;

		self._tickerForNewComments();
	},
	_tickerForNewComments:function(){
		var self = this,
			binding = self.getDefaultBinding();

		self.intervalId = setInterval(function () {
			window.Server.schoolEventCommentsCount.get({
				schoolId:   this.props.activeSchoolId,
				eventId:    self.props.eventId}
			)
			.then(function(res){
				var oldCount = binding.get('blogCount');
				if(oldCount && oldCount !== res.count) {
					self._setComments();
				}
				return res;
			});
		}, 30000);
	},
	componentWillUnmount:function(){
		var self = this,
			binding = self.getDefaultBinding();

		binding.remove('blogs');
		clearInterval(self.intervalId);
	},
	_commentButtonClick:function(){
		if(this.props.isUserCanWriteComments) {
			var self = this,
				binding = self.getDefaultBinding(),
				eventId = this.props.eventId,
				comments = ReactDOM.findDOMNode(self.refs.commentBox).value,
				replyTo = binding.get('replyTo'),
				replyName = replyTo ? `${replyTo.author.lastName} ${replyTo.author.firstName}` : null,
				postData = {text: comments};

			ReactDOM.findDOMNode(self.refs.commentBox).value = "";
			binding.sub('replyTo').clear();

			/**if reply and a comment contains the name*/
			if(replyTo && comments.indexOf(replyName) >= 0){
				postData.text = comments.replace(`${replyName},`, '').trim(); // remove reply name from comment
				postData.replyToCommentId = replyTo.id;// set reply comment in postData
			}

			return window.Server.schoolEventComments.post(
				{
					schoolId: this.props.activeSchoolId,
					eventId: eventId
				},
				postData
				)
				.then(function(comment) {
					const   blogs       = binding.toJS('blogs'),
						blogCount   = binding.toJS('blogCount');

					blogs.push(comment);

					binding.atomically()
						.set('blogCount',   Immutable.fromJS(blogCount + 1))
						.set('blogs',       Immutable.fromJS(blogs))
						.commit();
				});
		} else {
			window.simpleAlert(
				`Sorry, this feature is not available in your school`,
				'Ok',
				() => {}
			);
		}
	},
	onReply:function(blog){
		var     self    = this,
				binding = self.getDefaultBinding();

		binding.set('replyTo', blog);

		ReactDOM.findDOMNode(self.refs.commentBox).value = `${blog.author.firstName} ${blog.author.lastName}, `;
	},
	render:function(){
		const   self    = this,
				binding = self.getDefaultBinding();

		const   dataBlog 	= binding.toJS('blogs'),
				loggedUser 	= binding.toJS('loggedUser');

		return(
			<div className="bBlogMain">
				<CommentBox onReply={self.onReply} blogData={dataBlog} />
				<div>
					<div className="bBlog_box mNewComment">
						<div className="ePicBox">
							<Avatar pic={loggedUser && loggedUser.avatar} minValue={45} />
						</div>
						<div className="eEvent_commentBlog">
							<Morearty.DOM.textarea ref="commentBox" placeholder="Enter your comment" className="eEvent_comment"/>
						</div>
					</div>
					<div className="bEventButtons">
						<div onClick={self._commentButtonClick} className="bButton">Send</div>
					</div>
				</div>
			</div>
		)
	}
});
module.exports = Blog;