/**
 * Created by Anatoly on 29.05.2016.
 */
const 	Form 			= require('module/ui/form/form'),
		FormField 		= require('module/ui/form/form_field'),
		React 			= require('react'),
		SVG 			= require('module/ui/svg'),
		Morearty       	= require('morearty'),
		domainHelper 	= require('module/helpers/domain_helper');

const PasswordResetRequestForm = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount:function(){
		const 	self 		= this,
				binding 	= self.getDefaultBinding(),
				rootBinding = self.getMoreartyContext().getBinding(),
				secretKey 	= rootBinding.get('routing.parameters.secretKey');

		binding.set('secretKey', secretKey);
		self.tmpFormName = "Change password";
	},
	onSuccess:function(){
		alert('Password is changed.');
		window.location.href = domainHelper.getLoginUrl();
	},
	render: function() {
		const 	self 	= this,
				binding = self.getDefaultBinding();

		return (
			<div className="bPageMessage">
				<SVG classes="bLoginIcon" icon="icon_login"/>
				<Form name={self.tmpFormName} service={window.Server.passwordsReset} binding={binding} onSuccess={self.onSuccess}>
					<FormField type="confirmText" textType="password" field="newPassword" validation="password required">Password</FormField>
				</Form>
			</div>
		)
	}
});


module.exports = PasswordResetRequestForm;

