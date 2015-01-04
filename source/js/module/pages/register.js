var Popup = require('module/ui/popup'),
	RegisterModal;

RegisterModal = React.createClass({
	render: function() {
		return (
			<Popup isOpen={this.props.isOpen} onRequestClose={this.props.onRequestClose}>
				<div className="bRegisterForm">
					<div className="bPanel">
						<h2>Login or register {this.props.isOpen}</h2>

						<div className="ePanel_fieldSet">
							<div className="ePanel_fieldName">Login or email:</div>
							<input type="text" placeholder="" />
						</div>

						<div className="ePanel_fieldSet">
							<div className="ePanel_fieldName">Password:</div>
							<input type="password" />
						</div>

						<div className="ePanel_fieldSet mButton">
							<div className="bButton mLogin">Login →</div>
							<div className="bButton mRegister">Register</div>
						</div>

					</div>
				</div>
			</Popup>
		)
	}
});

module.exports = RegisterModal;
