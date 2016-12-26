/**
 * Created by Woland on 26.12.2016.
 */
const React 	= require('react'),
	Avatar 		= require('module/ui/avatar/avatar');

const Comments = React.createClass({
	propTypes:{
		avatarPic: 			React.PropTypes.string,
		avatarMinValue:		React.PropTypes.number,
		onClick:			React.PropTypes.func
	},

	render: function(){
		return (
			<div>
				<div className="bBlog_box mNewComment">
					<div className="ePicBox">
						<Avatar pic={this.props.avatarPic} minValue={this.props.avatarMinValue} />
					</div>
					<div className="eEvent_commentBlog">
						<textarea id="commentArea" placeholder="Enter your comment" className="eEvent_comment"></textarea>
					</div>
				</div>
				<div className="bEventButtons">
					<div onClick={this.props.onClick} className="bButton">Send</div>
				</div>
			</div>
		)
	}
});
module.exports = Comments;