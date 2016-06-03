const	Form		= require('module/ui/form/form'),
		FormField	= require('module/ui/form/form_field'),
		React		= require('react');

const SecuritySettingsPage = React.createClass({
	mixins: [Morearty.Mixin],
	onChangePassword: function(data) {
		window.Server.changePassword.put({
			oldPassword: data.oldPassword,
			newPassword: data.newPassword
		})
		.then(() => {
			document.location.hash = '/settings/general';
		})
		.catch(() => {
			alert("Please enter correct old password.");
		});
	},
	render: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return (
			<div>
				<Form
					formStyleClass="bSettingsForm"
					name="Change password"
					onSubmit={self.onChangePassword}
					binding={binding}
					defaultButton="Change"
					loadingButton="Saving..."
				>
					<FormField	type="text"
								field="oldPassword"
								validation="required"
					>
						Old Password
					</FormField>
					<FormField	type="confirmText"
								textType="password"
								field="newPassword"
								validation="required password"
					>
						New Password
					</FormField>
				</Form>
			</div>
		)
	}
});

module.exports = SecuritySettingsPage;