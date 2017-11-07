const 	React 		= require('react'),
		Comments 	= require('module/ui/comments/comments'),
		Loader 		= require('module/ui/loader');

const EventMessageComments = React.createClass({
	propTypes: {
		user: 				React.PropTypes.object.isRequired,
		comments: 			React.PropTypes.array.isRequired,
		onSubmitComment: 	React.PropTypes.func.isRequired,
		isSyncComments: 	React.PropTypes.bool.isRequired
	},
	
	render:function() {
		if (this.props.isSyncComments) {
			return (
				<Comments	user 		= {this.props.user}
							comments 	= {this.props.comments}
							onSubmit 	= {this.props.onSubmitComment}
				/>
			);
		} else {
			return <Loader condition = { true } />
		}
	}
});

module.exports = EventMessageComments;