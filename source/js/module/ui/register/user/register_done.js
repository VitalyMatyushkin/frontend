var RegiseterUserDone,
	SVG = require('module/ui/svg'),
	If = require('module/ui/if/if');

RegiseterUserDone = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		var self = this,
			globalBinding = self.getMoreartyContext().getBinding(),
			authorizationData = globalBinding.toJS('userData.authorizationInfo'),
			formData = self.getDefaultBinding().toJS();

		// Автоматическая авторизация, включающася в том случае, если пользователь только что зарегистрировался
		if (formData && !authorizationData || !authorizationData.userId) {
			window.Server.login.post({
				username: formData.username || formData.email,
				password: formData.password
			}).then(function(data) {
				// TODO: поместить данные авторизации в свойство authorizationInfo прямо на сервере, сейчас там хлам
				globalBinding.update('userData.userInfo', function(){
					return Immutable.fromJS(data.user);
				});

				// TODO: попросить Стаса отдавать нормальные данные
				globalBinding.update('userData.authorizationInfo', function(){
					return Immutable.fromJS({
						id: data.id,
						ttl: data.ttl,
						userId: data.userId,
						verified: data.user.verified,
						registerType: data.user.registerType
					});
				});
			});
		}
	},
	checkEmail: function() {
		var self = this,
			mailCode = self.refs.mailInput.getDOMNode().value,
			globalBinding = self.getMoreartyContext().getBinding(),
			userId = globalBinding.get('userData.authorizationInfo.userId');

		binding.meta().clear();
		window.Server.confirmUser.get({
			uid: userId,
			token: mailCode
		}).then(function() {
			globalBinding.set('userData.authorizationInfo.verified.email', true);
		}, function() {
			binding.meta().set('errorText', 'Verification error, please check the code')
		});


	},
	checkPhone: function() {
		var self = this,
			phoneCode = self.refs.phoneInput.getDOMNode().value;

	},
	render: function() {
		var self = this,
			globalBinding = self.getMoreartyContext().getBinding(),
			binding = self.getDefaultBinding(),
			isAuthorized = !!globalBinding.get('userData.authorizationInfo.userId'),
			verifiedMail = globalBinding.toJS('userData.authorizationInfo.verified.email'),
			verifiedPhone = globalBinding.toJS('userData.authorizationInfo.verified.phone');

		return (
			<div className="bPageMessage">
				<h2>Registration almost done</h2>

				<div className="bErrorText">{binding.meta().toJS('errorText')}</div>

				<div className="bVerifyRegister">
					<If condition={!isAuthorized}>
						<div className="eVerifyRegister_text">Loading...</div>
					</If>

					<If condition={isAuthorized}>
						<div>
							<div className="eVerifyRegister_text">Get verified and prove your're you</div>

							<If condition={!verifiedMail}>
								<div className="eVerifyRegister_field mEmail">
									<div className="eVerifyRegister_fieldText"><SVG icon="icon_envelope" />Confirmation email has been successfully sent to your email address.<br/> Enter the code from the message below:</div>
									<input className="eVerifyRegister_fieldInput" ref="mailInput"/>
									<div className="bButton" onClick={self.checkEmail}>check</div>
								</div>
							</If>

							<If condition={!verifiedPhone}>
								<div className="eVerifyRegister_field mPhone">
									<div className="eVerifyRegister_fieldText"><SVG icon="icon_phone" />Confirmation text has been successfully sent to your phone.<br/> Enter the code from the message below:</div>
									<input className="eVerifyRegister_fieldInput" ref="phoneInput" />
									<div className="bButton" onClick={self.checkPhone}>check</div>
								</div>
							</If>
						</div>
					</If>
				</div>

			</div>
		)
	}
});


module.exports = RegiseterUserDone;
