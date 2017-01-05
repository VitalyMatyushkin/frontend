/**
 * Created by bridark on 16/06/15.
 */
const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),

		CommentBox		= require('./event_blogBox'),
		NewCommentForm	= require('module/ui/comments/comments');

const Blog = React.createClass({
	mixins:[Morearty.Mixin],
	propTypes:{
		eventId					: React.PropTypes.string.isRequired,
		activeSchoolId			: React.PropTypes.string.isRequired,
		isUserCanWriteComments	: React.PropTypes.bool.isRequired
	},
	_setBlogCount:function(){
		const binding = this.getDefaultBinding();

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
		const binding = this.getDefaultBinding();

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

		this._setLoggedUser();
		// upload all comments from server
		this._setComments();
	},
	_setLoggedUser: function() {
		const	binding = this.getDefaultBinding();

		window.Server.profile.get().then(user => binding.set('loggedUser', Immutable.fromJS(user)))
	},
	// TODO HMMMMM???
	/**
	 * Function start timer, which send request on server with count comment
	 * If count don't equal old count, then call function with get comments
	 */
	componentDidMount: function() {
		//this._tickerForNewComments();
	},
	_tickerForNewComments:function(){
		const binding	= this.getDefaultBinding();

		this.intervalId = setInterval(() => {
			const self = this;

				window.Server.schoolEventCommentsCount.get({
					schoolId:   self.props.activeSchoolId,
					eventId:    self.props.eventId}
			)
			.then(res => {
				const oldCount = binding.get('blogCount');
				if(oldCount && oldCount !== res.count) {
					this._setComments();
				}
				return res;
			});
		}, 30000);
	},

	componentWillUnmount:function(){
		const binding = this.getDefaultBinding();

		binding.remove('blogs');
		clearInterval(this.intervalId);
	},

	onSubmitCommentClick: function(textComment){
		if(this.props.isUserCanWriteComments) {
			const binding 	= this.getDefaultBinding(),
				eventId 	= this.props.eventId,
				replyTo 	= binding.get('replyTo'),
				replyName 	= replyTo ? `${replyTo.author.lastName} ${replyTo.author.firstName}` : null,
				postData 	= {text: textComment};

			binding.sub('replyTo').clear();

			/**if reply and a comment contains the name*/
			if(replyTo && textComment.indexOf(replyName) >= 0){
				postData.text = textComment.replace(`${replyName},`, '').trim(); // remove reply name from comment
				postData.replyToCommentId = replyTo.id; // set reply comment in postData
			}

			return window.Server.schoolEventComments.post(
				{
					schoolId: this.props.activeSchoolId,
					eventId: eventId
				},
					postData
				)
				.then(comment => {
					const blogs 	= binding.toJS('blogs'),
						blogCount 	= binding.toJS('blogCount');

					blogs.push(comment);

					binding.atomically()
						.set('blogCount', 	Immutable.fromJS(blogCount + 1))
						.set('blogs', 		Immutable.fromJS(blogs))
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
		const binding = this.getDefaultBinding();
		binding.set('replyTo', blog);
	},
	render:function(){
		const binding 		= this.getDefaultBinding(),
			dataBlog 		= binding.toJS('blogs'),
			loggedUser 		= binding.toJS('loggedUser'),
			replyTo			= binding.toJS('replyTo') ? binding.toJS('replyTo')	: null,
			commentText 	= replyTo ? replyTo.author.firstName + ' ' + replyTo.author.lastName + ', ': '';

		return(
			<div className="bBlogMain">
				<CommentBox onReply={this.onReply} blogData={dataBlog} />
				<NewCommentForm commentText={commentText} avatarMinValue={45} avatarPic={loggedUser && loggedUser.avatar} onClick={this.onSubmitCommentClick} />
			</div>
		)
	}
});
module.exports = Blog;