const	React				= require('react'),
		{ConfirmPopup}		= require('module/ui/confirm_popup'),
		InvitePopupStyleCss	= require('../../../../../../styles/ui/b_invite_popup.scss');

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

	handlerClosePopup: function(){
		this.props.onClosePopup();
	},

	render: function(){
		const	isConfirmPopup		= this.props.isConfirmPopup,
				type 				= this.props.type,
				inviteId 			= this.props.inviteId,
				commentText			= this.state.text;

		if (isConfirmPopup) {
			return (
				<ConfirmPopup	okButtonText 			= "Ok"
								cancelButtonText		= "Cancel"
								handleClickOkButton		= { this.props.onDecline.bind(null, inviteId, commentText)}
								handleClickCancelButton	= { this.handlerClosePopup }
								isOkButtonDisabled		= { false }
				>
					<div className="bInvitePopup">
						<p>Are you sure you want to {type}?</p>
						<textarea	className	= "eInvitePopup_textArea"
									value		= {this.state.text}
									onChange	= {this.onChangeTextarea}
									placeholder	= "Enter your comment"
						/>
					</div>
				</ConfirmPopup>
			);
		} else {
			return null;
		}
	}
});

module.exports = ConfirmDeclinePopup;