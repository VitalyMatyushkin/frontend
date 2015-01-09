var Popup = require('module/ui/popup'),
	RegisterModal;

RegisterModal = React.createClass({
	propTypes: {
		onRequestClose: React.PropTypes.func.isRequired,
		onLoginDone: React.PropTypes.func.isRequired
	},
	mixins: [Morearty.Mixin],
	blocked: false,
	tryToClose: function() {
		var self = this;

		if(!self.blocked) {
			self.props.onRequestClose();
		}

	},
	tryToLogin: function() {
		var self = this,
			binding = self.getDefaultBinding();

		self.blockForm();

		$.ajax({
			url: 'http://api.squadintouch.com:80/v1/users/login',
			type: 'POST',
			crossDomain: true,
			data: {
				username: self.refs['login'].getDOMNode().value,
				password: self.refs['password'].getDOMNode().value
			},
			error: function(data) {
				var response = data.responseJSON;

				response && response.error && response.error.message && self.showMessage(response.error.message);
				self.unblockForm();
			},
			success: function(data) {
				if(data.id) {
					self.props.onLoginDone(data);
					self.unblockForm();
				}
			}
		});
	},
	tryToPressKey: function(event) {
		var self = this;

		if(event.key === 'Enter') {
			self.tryToLogin();
		}
	},
	showMessage: function (message){
		var self = this,
			messagePanel = self.refs['message'].getDOMNode(),
			form = self.refs['form'].getDOMNode();

		messagePanel.innerHTML = message;
		form.classList.add('mMessage');
	},
	hideMessage: function (){
		var self = this,
			form = self.refs['form'].getDOMNode();

		form.classList.remove('mMessage');
	},
	blockForm: function() {
		var self = this,
			form = self.refs['form'].getDOMNode();

		self.blocked = true;
		form.classList.add('mBlocked');
	},
	unblockForm: function() {
		var self = this,
			form = self.refs['form'].getDOMNode();

		self.blocked = false;
		form.classList.remove('mBlocked');
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			isBlocked = binding.get('blocked'),
			popupClass = 'bRegisterForm' + (isBlocked ? ' mBlocked' : '');

		return (
			<Popup binding={binding} stateProperty="isOpened" onRequestClose={self.tryToClose}>
				<div className="bRegisterForm" ref="form">

					<div className="eRegisterForm_state mLogin">
						<div className="bPanel">
							<h2>Login or register</h2>

							<div className="ePanel_blocked"></div>

							<div className="ePanel_fieldSet">
								<div className="ePanel_fieldName">Login or email:</div>
								<input type="text" ref="login" />
							</div>

							<div className="ePanel_fieldSet">
								<div className="ePanel_fieldName">Password:</div>
								<input type="password" ref="password" onKeyPress={self.tryToPressKey} />
							</div>

							<div className="ePanel_fieldSet mButtons">
								<div className="bButton mLeft" onClick={self.tryToLogin}>Login →</div>
								<div className="bButton mRight">Register</div>
							</div>

						</div>
					</div>

					<div className="eRegisterForm_state mMessage">
						<div className="eRegisterForm_messageWrap">
							<div className="eRegisterForm_message" ref="message"></div>
							<div className="bButton" onClick={self.hideMessage}>Ok</div>
						</div>
					</div>
				</div>
			</Popup>
		)
	}
});

module.exports = RegisterModal;
