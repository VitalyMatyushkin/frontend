const	React			= require('react'),
		PopupMessage	= require('./../popup_message/popup_message');

const CookiePopupMessage = React.createClass({
	getInitialState: function(){
		return {
			isCookiePopupDisplaying: true
		};
	},
	handleClickOkButton: function() {
		this.setState( {'isCookiePopupDisplaying': false} );
	},
	render: function() {

		return (
			<PopupMessage	isDisplaying		= { this.state.isCookiePopupDisplaying }
							handleClickOkButton	= { this.handleClickOkButton }
			>
				We use cookies to provide you the best experience on our Website.
				Please read our cookie policy to find out more.
				By continuing to browse our Website, you are agreeing to our use of cookies.
				Please read our <a className="ePopupMessage_ref" href="cookies_policy_v1.0.docx">cookie policy</a> to find out more.
			</PopupMessage>
		);
	}
});

module.exports = CookiePopupMessage;



