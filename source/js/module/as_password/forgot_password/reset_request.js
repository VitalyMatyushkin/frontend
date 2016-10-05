/**
 * Created by Anatoly on 29.05.2016.
 */
const 	Form 			= require('module/ui/form/form'),
		FormField 		= require('module/ui/form/form_field'),
		React 			= require('react'),
		SVG 			= require('module/ui/svg'),
		Morearty        = require('morearty'),
		domainHelper 	= require('module/helpers/domain_helper');

const PasswordResetRequestForm = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount:function(){
		const self = this;
		self.tmpFormName = "Forgot password";
	},
	onSuccess:function(){
		window.simpleAlert(
			'The request to change the password was sent by email.',
			'Ok',
			() => {}
		);
		window.location.href = domainHelper.getLoginUrl();
	},
	render: function() {
		const 	self 	= this,
				binding = self.getDefaultBinding();

		return (
		<div className="bPageMessage">
			<SVG classes="bLoginIcon" icon="icon_login"/>
			<Form name={self.tmpFormName} service={window.Server.passwordsResetRequest} binding={binding} onSuccess={self.onSuccess}>
				<FormField type="text" placeholder="E-mail" field="email" validation="email required" />
			</Form>
		</div>
		)
	}
});


module.exports = PasswordResetRequestForm;
