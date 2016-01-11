const 	Form 		= require('module/ui/form/form'),
		FormField 	= require('module/ui/form/form_field'),
		FormColumn 	= require('module/ui/form/form_column'),
		React 		= require('react'),
		ReactDOM 	= require('reactDom'),
		Immutable 	= require('immutable');

const SecuritySettingsPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			userId = globalBinding.get('userData.authorizationInfo.userId');

		if (userId) {
			window.Server.user.get(userId).then(function (data) {
				self.isMounted() && binding.set('emailForm', Immutable.fromJS(data));
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
		var self = this;

		return (
			<div>
				<Form formStyleClass="bSettingsForm" name="Change email" onSubmit={self.submitEdit} binding={self.getDefaultBinding().sub('emailForm')} defaultButton="Change" loadingButton="Saving..." >
					<FormField type="confirmText" field="email" validation="required email">Email</FormField>
				</Form>

				<Form formStyleClass="bSettingsForm" name="Change password" onSubmit={self.submitEdit} binding={self.getDefaultBinding().sub('passwordForm')} defaultButton="Change" loadingButton="Saving..." >
					<FormField type="confirmText" field="password" validation="required">Password</FormField>
				</Form>
			</div>
		)
	}
});


module.exports = SecuritySettingsPage;
