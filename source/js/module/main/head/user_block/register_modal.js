var Popup = require('module/ui/popup'),
	RegisterModal;

RegisterModal = React.createClass({
	mixins: [Morearty.Mixin],
	tryToLogin: function(){
		var self = this,
			binding = self.getDefaultBinding();

		$.ajax({
			url: 'http://api.squadintouch.com:80/v1/users/login',
			type: 'POST',
			crossDomain: true,
			data: {
				username: self.refs['login'].getDOMNode().value,
				password: self.refs['password'].getDOMNode().value
			},
			success: function(data) {

				if(data.id) {
					binding.set('authorizationInfo', data);
					self.props.onRequestClose();
				}
			}
		});

	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<Popup binding={binding.sub('registerModal') } stateProperty="isOpened" onRequestClose={this.props.onRequestClose}>
				<div className="bRegisterForm">
					<div className="bPanel">
						<h2>Login or register</h2>

						<div className="ePanel_fieldSet">
							<div className="ePanel_fieldName">Login or email:</div>
							<input type="text" ref="login" value="test1" />
						</div>

						<div className="ePanel_fieldSet">
							<div className="ePanel_fieldName">Password:</div>
							<input type="password" ref="password" value="test" />
						</div>

						<div className="ePanel_fieldSet mButton">
							<div className="bButton mLogin" onClick={this.tryToLogin}>Login →</div>
							<div className="bButton mRegister">Register</div>
						</div>

					</div>
				</div>
			</Popup>
		)
	}
});

module.exports = RegisterModal;
