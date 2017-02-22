const	Form		= require('module/ui/form/form'),
		FormField	= require('module/ui/form/form_field'),
		Morearty    = require('morearty'),
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
			window.simpleAlert(
				"Please enter correct old password.",
				'Ok',
				() => {}
			);
		});
	},
	onCancel:function(){
		window.location.hash = '/settings/general';
	},
	render: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return (
			<div>
				<div className="container">
					<div className="row">
						<div className="col-md-10 col-md-offset-1">
							<Form
								formStyleClass="bSettingsForm mLeft"
								name="Change password"
								onSubmit={self.onChangePassword}
								binding={binding}
								defaultButton="Change"
								loadingButton="Saving..."
								autoupdateOff={true}
								onCancel={this.onCancel}
								>
								<FormField type="text"
										   textType="password"
										   field="oldPassword"
										   validation="required"
										   fieldClassName="mLarge"
									>
									Old Password
								</FormField>
								<FormField type="confirmText"
										   textType="password"
										   field="newPassword"
										   validation="required password"
										   fieldClassName="mLarge"
									>
									New Password
								</FormField>
							</Form>
						</div>
					</div>
				</div>
			</div>
		)
	}
});

module.exports = SecuritySettingsPage;