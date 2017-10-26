/**
 * Created by bridark on 16/06/15.
 */
const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),
		Comments		= require('../../../../ui/comments/comments'),
		RoleHelper		= require('module/helpers/role_helper');

const Blog = React.createClass({
	mixins:[Morearty.Mixin],
	propTypes:{
		eventId					: React.PropTypes.string.isRequired,
		activeSchoolId			: React.PropTypes.string.isRequired,
		isUserCanWriteComments	: React.PropTypes.bool.isRequired
	},
	isShowRemoveLink: function () {
		return RoleHelper.getLoggedInUserRole(this) === 'ADMIN';
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
		const 	binding 	= this.getDefaultBinding(),
				rootBinding	= this.getMoreartyContext().getBinding(),
				role		= RoleHelper.getLoggedInUserRole(this);

		return window.Server.schoolEventComments.get(
			{
				schoolId	: this.props.activeSchoolId,
				eventId		: this.props.eventId
			},
			{
				filter: {
					limit: 100
				}
			}
		).then(blogs => {
			binding
				.atomically()
				.set('blogs',		Immutable.fromJS(blogs))
				.set('blogCount',	Immutable.fromJS(blogs.length))
				.commit();

			return true;
		});
	},
	componentWillMount:function(){
		const 	binding 	= this.getDefaultBinding(),
				rootBinding	= this.getMoreartyContext().getBinding(),
				role		= RoleHelper.getLoggedInUserRole(this);

		binding.set('isSync', false);

		this._setLoggedUser()
			.then(() => {
				// upload all comments from server
				return this._setComments();
			})
			.then(() => {
				binding.set('isSync', true);

				return true;
			});


	},
	_setLoggedUser: function() {
		const	binding 	= this.getDefaultBinding(),
				rootBinding	= this.getMoreartyContext().getBinding(),
				role		= RoleHelper.getLoggedInUserRole(this);

		return window.Server.profile.get()
			.then(user => {
				binding.set('loggedUser', Immutable.fromJS(user));

				return true;
			});
	},
	/**
	 * Function start timer, which send request on server with count comment
	 * If count don't equal old count, then call function with get comments
	 */
	componentDidMount: function() {
		const 	rootBinding	= this.getMoreartyContext().getBinding(),
				role		= RoleHelper.getLoggedInUserRole(this);

		this._tickerForNewComments();

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
	onRemove: function (comment) {
		window.confirmAlert(
			`Are you sure?`,
			"Ok",
			"Cancel",
			() => {
				window.Server.schoolEventComment.delete(
					{
						schoolId	: this.props.activeSchoolId,
						eventId		: this.props.eventId,
						commentId	: comment.id
					}
				).then(() => {
					this._setComments();
				});
			},
			() => {}
		);
	},
	onSubmitCommentClick: function(newCommentText, replyComment){
		if(this.props.isUserCanWriteComments) {
			const binding 	= this.getDefaultBinding();

			const postData = {
				text: newCommentText
			};
			if(typeof replyComment !== 'undefined') {
				postData.replyToCommentId = replyComment.id;
			}

			return window.Server.schoolEventComments.post(
				{
					schoolId	: this.props.activeSchoolId,
					eventId		: this.props.eventId
				},
					postData
				)
				.then(comment => {
					const	blogs		= binding.toJS('blogs'),
							blogCount	= binding.toJS('blogCount');

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
	render:function(){
		const	binding		= this.getDefaultBinding(),
				dataBlog	= binding.toJS('blogs'),
				loggedUser	= binding.toJS('loggedUser');

		if(binding.get('isSync')) {
			return(
				<div className="bBlogMain">
					<Comments
						user				= { loggedUser }
						comments			= { dataBlog }
						onSubmit			= { this.onSubmitCommentClick }
						onRemove			= { this.onRemove }
						isShowRemoveLink	= { this.isShowRemoveLink() }
					/>
				</div>
			);
		} else {
			return null;
		}

	}
});

module.exports = Blog;