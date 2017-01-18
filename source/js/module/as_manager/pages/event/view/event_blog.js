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
		const 	binding = this.getDefaultBinding(),
				rootBinding	= this.getMoreartyContext().getBinding(),
				isStudent	= RoleHelper.isStudent(this);
		/**
		 * If role not equal student, do everything as usual
		 */
		if (!isStudent) {
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
		)
		.then(blogs => {
			binding
				.atomically()
				.set('blogs',		Immutable.fromJS(blogs))
				.set('blogCount',	Immutable.fromJS(blogs.length))
				.commit();

			return true;
		});
		} else {
			const blogs = [];
			binding
				.atomically()
				.set('blogs',		Immutable.fromJS(blogs))
				.set('blogCount',	Immutable.fromJS(blogs.length))
				.commit();
		}
	},
	componentWillMount:function(){
		const 	binding = this.getDefaultBinding(),
				rootBinding	= this.getMoreartyContext().getBinding(),
				isStudent	= RoleHelper.isStudent(this);

		binding.set('isSync', false);
		/**
		 * If role not equal student, do everything as usual
		 */
		if (!isStudent) {
			this._setLoggedUser()
				.then(() => {
					// upload all comments from server
					return this._setComments();
				})
				.then(() => {
					binding.set('isSync', true);

					return true;
				});
		} else {
			this._setLoggedUser();
			this._setComments();
			binding.set('isSync', true);
		}

	},
	_setLoggedUser: function() {
		const	binding = this.getDefaultBinding(),
				rootBinding	= this.getMoreartyContext().getBinding(),
				isStudent	= RoleHelper.isStudent(this);

		/**
		 * If role not equal student, do everything as usual
		 */
		if (!isStudent) {
		return window.Server.profile.get()
			.then(user => {
				binding.set('loggedUser', Immutable.fromJS(user));

				return true;
			});
		} else {
			const user = {"id":"587ca8cf3fc0db2866ecd5ac","updatedAt":"2017-01-18T06:29:09.567Z","createdAt":"2017-01-16T11:04:47.970Z","firstName":"Elsa","lastName":"Frozen","email":"bestia21v@yandex.ru","phone":"+79509521988#100","gender":"FEMALE","avatar":"//img.stage1.squadintouch.com/images/oqy4pixi3ecvjpyev1g33syb3g52sn6l7is2_1484718933256.png","birthday":"2000-01-01","notification":{"sendPromoOffers":false,"sendInfoUpdates":false,"sendNews":false},"verification":{"status":{"personal":false,"email":true,"sms":true}},"status":"ACTIVE"};
			binding.set('loggedUser', Immutable.fromJS(user));
		}
	},
	// TODO HMMMMM???
	/**
	 * Function start timer, which send request on server with count comment
	 * If count don't equal old count, then call function with get comments
	 */
	componentDidMount: function() {
		const 	rootBinding	= this.getMoreartyContext().getBinding(),
				isStudent	= RoleHelper.isStudent(this);
		/**
		 * If role not equal student, do everything as usual
		 */
		if (!isStudent) {
			this._tickerForNewComments();
		}
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
					<Comments	user		= {loggedUser}
								comments	= {dataBlog}
								onSubmit	= {this.onSubmitCommentClick}
					/>
				</div>
			);
		} else {
			return null;
		}

	}
});
module.exports = Blog;