const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),
		PopupMessage	= require('./../popup_message/popup_message');

const CookiePopupMessage = React.createClass({
	mixins: [Morearty.Mixin],

	handleClickOkButton: function() {
		this.getDefaultBinding().set('isCookiePopupDisplaying', Immutable.fromJS(false));
	},
	render: function() {

		return (
			<PopupMessage	isDisplaying		= { this.getDefaultBinding().toJS('isCookiePopupDisplaying') }
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



