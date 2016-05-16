const 	Form 			= require('module/ui/form/form'),
		FormColumn 		= require('module/ui/form/form_column'),
		FormField 		= require('module/ui/form/form_field'),
		React 			= require('react'),
		Immutable 		= require('immutable');

const GeneralSettingsPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const   self    = this,
                binding = self.getDefaultBinding();

        window.Server.profile.get().then(function (data) {
            binding.set(Immutable.fromJS(data));
        });
	},
	submitEdit: function(data) {
        if(!data.password)
            delete data.password;

		window.Server.profile.put(data).then(function() {
            window.history.back();
		});
	},
	render: function() {
		var self = this,
            binding = self.getDefaultBinding();

		return (
			<Form formStyleClass="bSettingsForm" name="General settings" onSubmit={self.submitEdit} binding={binding} defaultButton="Save" loadingButton="Saving..." >
				<FormColumn type="column">
					<FormField type="text" field="firstName" validation="required alphanumeric">First name</FormField>
					<FormField type="text" field="lastName" validation="required alphanumeric">Last name</FormField>
					<span className="bSettingEmailVerify">{binding.toJS('verified.email') !== undefined && binding.toJS('verified.email') === true ? <span className="bPopup_verified">v</span> : <span onClick={function(){console.log('click')}}>verify email</span>}</span>
					<FormField type="text" field="email" validation="required email">Email</FormField>
					<span className="bSettingPhoneVerify">{binding.toJS('verified.phone') !== undefined && binding.toJS('verified.phone') === true ? <span className="bPopup_verified">v</span> : <span>verify phone</span>}</span>
					<FormField type="phone" field="phone" validation="phone">Phone number</FormField>
					<FormField type="confirmText" textType="password" field="password" validation="password">Password</FormField>
				</FormColumn>
				<FormColumn type="column">
					<FormField labelText="Upload New Avatar" type="imageFile" typeOfFile="image" field="avatar"/>
				</FormColumn>
			</Form>
		)
	}
});


module.exports = GeneralSettingsPage;
