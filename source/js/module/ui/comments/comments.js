/**
 * Created by Woland on 26.12.2016.
 */
const React 	= require('react'),
	Avatar 		= require('module/ui/avatar/avatar');

const NewCommentForm = React.createClass({
	propTypes:{
		avatarPic: 			React.PropTypes.string,
		textTextarea: 		React.PropTypes.string,
		avatarMinValue:		React.PropTypes.number,
		onClick:			React.PropTypes.func
	},
	getInitialState: function(){
	 	return {text : ''}
	 },

	componentWillReceiveProps: function(nextProps){
		this.setState({text: nextProps.textTextarea});
	},

	handleOnChange: function(e){
		this.setState({text: e.target.value});
		e.stopPropagation();
	},

	handleOnClick: function(){
		this.props.onClick(this.state.text);
	},

	render: function(){
		return (
			<div>
				<div className="bBlog_box mNewComment">
					<div className="ePicBox">
						<Avatar pic={this.props.avatarPic} minValue={this.props.avatarMinValue} />
					</div>
					<div className="eEvent_commentBlog">
						<textarea onChange={this.handleOnChange} value={this.state.text} placeholder="Enter your comment" className="eEvent_comment"></textarea>
					</div>
				</div>
				<div className="bEventButtons">
					<div onClick={this.handleOnClick} className="bButton">Send</div>
				</div>
			</div>
		)
	}
});
module.exports = NewCommentForm;