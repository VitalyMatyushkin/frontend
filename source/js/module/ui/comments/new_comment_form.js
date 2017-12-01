const	React				= require('react'),
		Button				= require('../button/button'),
		{Avatar} 			= require('module/ui/avatar/avatar'),
		CommentAvatar		= require('./comment_avatar'),
		NewCommentFormStyle	= require('../../../../styles/ui/comments/b_new_comment_form.scss');

/**
 * Form for new comment.
 * Contain staff like this - user avatar, user name, text form for comment and submit button.
 */
const NewCommentForm = React.createClass({
	propTypes: {
		// Avatar of user which post the comment
		avatarPic		: React.PropTypes.string,
		// Text of comment
		text			: React.PropTypes.string,
		// Handler for change text
		onChangeText	: React.PropTypes.func.isRequired,
		// Handler for click on submit comment button
		onSubmit		: React.PropTypes.func.isRequired,
		//flag for focus textarea
		focus 			: React.PropTypes.bool.isRequired
	},
	componentWillReceiveProps:function(nextProps){
		if(this.props.focus != nextProps.focus) {
			this.textarea.focus();
		}
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
		return (
			<div className="bNewCommentForm">
				<div className="eNewCommentForm_body">
					<CommentAvatar avatar={this.props.avatarPic}/>
					<div className="eNewCommentForm_textareaWrapper">
						<textarea	className	= "eNewCommentForm_textarea"
									value		= {this.getText()}
									placeholder	= "Enter your comment"
									onChange	= {this.onChangeText}
									ref			= {textarea => {this.textarea = textarea;}}
						/>
					</div>
				</div>
				<div className="eNewCommentForm_footer">
					<Button	text	= "Send"
							onClick	= {this.props.onSubmit}
					/>
				</div>
			</div>
		)
	}
});

module.exports = NewCommentForm;