/**
 * Created by bridark on 16/06/15.
 */
const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),

		If				= require('../../../../ui/if/if'),
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
		const binding = this.getDefaultBinding();

		this.intervalId = setInterval( () => {
			window.Server.schoolEventCommentsCount.get({
				schoolId:	this.props.activeSchoolId,
				eventId:	this.props.eventId}
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

	_commentButtonClick:function(textComment){
		if(this.props.isUserCanWriteComments) {
			const binding 	= this.getDefaultBinding(),
				eventId 	= this.props.eventId,
				comments 	= textComment,
				replyTo 	= binding.get('replyTo'),
				replyName 	= replyTo ? `${replyTo.author.lastName} ${replyTo.author.firstName}` : null,
				postData 	= {text: comments};

			binding.sub('replyTo').clear();

			/**if reply and a comment contains the name*/
			if(replyTo && comments.indexOf(replyName) >= 0){
				postData.text = comments.replace(`${replyName},`, '').trim(); // remove reply name from comment
				postData.replyToCommentId = replyTo.id; // set reply comment in postData
			}

			return window.Server.schoolEventComments.post(
				{
					schoolId: this.props.activeSchoolId,
					eventId: eventId
				},
					postData
				)
				.then(function(comment) {
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
		document.getElementById('commentArea').value = `${blog.author.firstName} ${blog.author.lastName}, `;
	},
	render:function(){
		const binding 	= this.getDefaultBinding(),
			dataBlog 	= binding.toJS('blogs'),
			loggedUser 	= binding.toJS('loggedUser');

		return(
			<div className="bBlogMain">
				<CommentBox onReply={this.onReply} blogData={dataBlog} />
				<NewCommentForm textTextarea={''} avatarMinValue={45} avatarPic={loggedUser && loggedUser.avatar} onClick={this._commentButtonClick} />
			</div>
		)
	}
});
module.exports = Blog;