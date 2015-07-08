var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	FormColumn = require('module/ui/form/form_column'),
    SVG = require('module/ui/svg'),
	GeneralSettingsPage;

GeneralSettingsPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			userId = globalBinding.get('userData.authorizationInfo.userId');

		if (userId) {
			window.Server.user.get(userId).then(function (data) {
				self.isMounted() && binding.set(Immutable.fromJS(data));
			});

			self.userId = userId;
		}
	},
	submitEdit: function(data) {
		var self = this;

		data.id = self.userId;

		self.userId && window.Server.user.put(self.userId, data).then(function() {

		});
	},
	render: function() {
		var self = this,
            binding = self.getDefaultBinding();
		return (
			<Form formStyleClass="bSettingsForm" name="General settings" onSubmit={self.submitEdit} binding={self.getDefaultBinding()} defaultButton="Save" loadingButton="Saving..." >
				<FormField type="text" field="firstName" validation="required alphanumeric">First name</FormField>
				<FormField type="text" field="lastName" validation="required alphanumeric">Last name</FormField>
                <span className="bSettingEmailVerify">{binding.toJS('verified.email') !== undefined && binding.toJS('verified.email') === true ? <span className="bPopup_verified">v</span> : <span onClick={function(){console.log('click')}}>verify email</span>}</span>
                <FormField type="text" field="email" validation="required email">Email</FormField>
                <span className="bSettingPhoneVerify">{binding.toJS('verified.phone') !== undefined && binding.toJS('verified.phone') === true ? <span className="bPopup_verified">v</span> : <span>verify phone</span>}</span>
                <FormField type="text" field="phone" validation="phone">Phone number</FormField>
                <FormField type="text" field="password" validation="required alphanumeric">Password</FormField>
			</Form>
		)
	}
});


module.exports = GeneralSettingsPage;
