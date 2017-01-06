const	React	= require('react'),
		Button	= require('../button/button'),
		Avatar	= require('../avatar/avatar');

/**
 * Form for new comment.
 * Contain staff like this - user avatar, user name, text form for comment and submit button.
 */
const NewCommentForm = React.createClass({
	propTypes: {
		// Avatar of user which post the comment
		avatarPic		: React.PropTypes.string,
		//TODO What is avatarMinValue?
		avatarMinValue	: React.PropTypes.number,
		// Text of comment
		text			: React.PropTypes.string,
		// Handler for change text
		onChangeText	: React.PropTypes.func.isRequired,
		// Handler for click on submit comment button
		onSubmit		: React.PropTypes.func.isRequired
	},

	/**
	 * Function return text of new comment from props.text.
	 * If props.text is undefined, then function return empty string.
	 * @returns {string}
	 */
	getText: function() {
		return typeof this.props.text !== "undefined" ? this.props.text : '';
	},
	onChangeText: function(eventDescriptor) {
		this.props.onChangeText(eventDescriptor.target.value);
	},

	render: function(){
		// TODO move to a garbage these shitty css classes and write new with normal names.
		return (
			<div>
				<div className="bBlog_box mNewComment">
					<div className="ePicBox">
						<Avatar	pic			= {this.props.avatarPic}
								minValue	= {this.props.avatarMinValue}
						/>
					</div>
					<div className="eEvent_commentBlog">
						<textarea	className	= "eEvent_comment"
									value		= {this.getText()}
									placeholder	= "Enter your comment"
									onChange	= {this.onChangeText}
						/>
					</div>
				</div>
				<div className="bEventButtons">
					<Button	text	= "Send"
							onClick	= {this.props.onSubmit}
					/>
				</div>
			</div>
		)
	}
});

module.exports = NewCommentForm;