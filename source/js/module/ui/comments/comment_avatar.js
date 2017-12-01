const	React				= require('react'),
		{Avatar} 			= require('module/ui/avatar/avatar'),
		CommentAvatarStyle	= require('../../../../styles/ui/comments/b_comment_avatar.scss');

const CommentAvatar = React.createClass({
	propTypes: {
		avatar: React.PropTypes.string
	},
	render: function() {
		return (
			<div className="bCommentAvatar">
				<Avatar pic={this.props.avatar}/>
			</div>
		);
	}
});

module.exports = CommentAvatar;