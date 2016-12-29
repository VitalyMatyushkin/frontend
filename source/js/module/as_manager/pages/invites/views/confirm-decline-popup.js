const React = require('react'),
	ConfirmPopup	= require('module/ui/confirm_popup');

const ConfirmDeclinePopup = React.createClass({
	propTypes: {
		type: 						React.PropTypes.string.isRequired,
		commentText: 				React.PropTypes.string.isRequired,
		isConfirmPopup:				React.PropTypes.bool.isRequired,
		inviteId: 					React.PropTypes.string.isRequired,
		onClosePopup:				React.PropTypes.func.isRequired,
		onDecline:					React.PropTypes.func.isRequired
	},

	getInitialState: function(){
		return {text : ''}
	},

	onChangeTextarea: function(e){
		this.setState({text: e.target.value});
		e.stopPropagation();
	},

	componentWillReceiveProps: function(nextProps){
		this.setState({text: nextProps.commentText});
	},

	renderTextarea: function (){
		const type = this.props.type,
			style = {
				resize: 'none',
				width: '100%',
				border: '1px solid #d7d7d7'
			};

		return (
			<div>
				<p>Are you sure you want to {type}?</p>
				<div>
					<textarea value={this.state.text} onChange={this.onChangeTextarea} style={style} placeholder="Enter your comment"></textarea>
				</div>
			</div>
		);
	},

	handlerClosePopup: function(){
		this.props.onClosePopup();
	},

	render: function(){
		const isConfirmPopup 	= this.props.isConfirmPopup,
			type 				= this.props.type,
			inviteId 			= this.props.inviteId,
			commentText			= this.state.text;

		if (isConfirmPopup) {
			return (
				<ConfirmPopup okButtonText 				= "Ok"
							  cancelButtonText			= "Cancel"
							  handleClickOkButton		= {
								  () => { this.props.onDecline(inviteId, commentText) }
							  }
							  handleClickCancelButton	= { this.handlerClosePopup }
							  isOkButtonDisabled		= { false }
				>
					{ this.renderTextarea() }
				</ConfirmPopup>
			);
		} else {
			return null;
		}
	}
});

module.exports = ConfirmDeclinePopup;