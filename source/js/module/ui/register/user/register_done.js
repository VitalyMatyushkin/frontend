var RegiseterUserDone,
	SVG = require('module/ui/svg'),
	If = require('module/ui/if/if');

RegiseterUserDone = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		var self = this,
			globalBinding = self.getMoreartyContext().getBinding(),
			formData = self.getDefaultBinding().toJS();

		window.Server.login.post({
			username: formData.username || formData.email,
			password: formData.password
		}).then(function(data) {
			// TODO: поместить данные авторизации в свойство authorizationInfo прямо на сервере, сейчас там хлам
			globalBinding.update('userData', function(){
				return Immutable.fromJS(data.user);
			});

			// TODO: попросить Стаса отдавать нормальные данные
			globalBinding.update('userData.authorizationInfo', function(){
				return Immutable.fromJS({
					id: data.id,
					ttl: data.ttl,
					userId: data.userId
				});
			});

			console.log(globalBinding.toJS())
		});
	},
	render: function() {
		var self = this,
			globalBinding = self.getMoreartyContext().getBinding(),
			binding = self.getDefaultBinding();

		return (
			<div className="bPageMessage">
				<h2>Registration almost done</h2>

				<div className="bVerifyRegister">
					<If condition={!globalBinding.get('userData.authorizationInfo.userId')}>
						<div className="eVerifyRegister_text">Loading...</div>
					</If>

					<If condition={globalBinding.get('userData.authorizationInfo.userId')}>
						<div className="eVerifyRegister_text">Get verified and prove your're you</div>

						<div className="eVerifyRegister_field mEmail">
							<div className="eVerifyRegister_fieldText"><SVG icon="icon_envelope" />Confirmation email has been successfully sent to your email address.<br/> Enter the code from the message below:</div>
							<input className="eVerifyRegister_fieldInput" />
							<div className="bButton">check</div>
						</div>

						<div className="eVerifyRegister_field mPhone">
							<div className="eVerifyRegister_fieldText"><SVG icon="icon_phone" />Confirmation text has been successfully sent to your phone.<br/> Enter the code from the message below:</div>
							<input className="eVerifyRegister_fieldInput" />
							<div className="bButton">check</div>
						</div>
					</If>
				</div>

			</div>
		)
	}
});


module.exports = RegiseterUserDone;
