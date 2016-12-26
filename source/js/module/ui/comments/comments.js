/**
 * Created by Woland on 26.12.2016.
 */
const React = require('react');

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
						<Avatar pic={props.avatarPic} minValue={props.avatarMinValue} />
					</div>
					<div className="eEvent_commentBlog">
						<Textarea ref="commentBox" placeholder="Enter your comment" className="eEvent_comment"/>
					</div>
				</div>
				<div className="bEventButtons">
					<div onClick={props.onClick()} className="bButton">Send</div>
				</div>
			</div>
		)
	}
});