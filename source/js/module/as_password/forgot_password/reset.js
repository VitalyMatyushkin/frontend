/**
 * Created by Anatoly on 29.05.2016.
 */
const	Form			= require('module/ui/form/form'),
		FormField 		= require('module/ui/form/form_field'),
		React			= require('react'),
		{SVG}			= require('module/ui/svg'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),
		domainHelper	= require('module/helpers/domain_helper');

const PasswordResetRequestForm = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount:function(){
		const	self		= this,
				binding		= self.getDefaultBinding(),
				rootBinding	= self.getMoreartyContext().getBinding();

		binding.set('secretKey', Immutable.fromJS(rootBinding.get('routing.parameters.secretKey')));
	},
	submitEdit: function(data) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		window.Server.passwordsReset.post({
			newPassword :	data.newPassword,
			secretKey :		binding.get('secretKey')
		}).then(() => {
			window.simpleAlert(
				'Password is changed.',
				'Ok',
				() => {window.location.href = domainHelper.getLoginUrl();}
			);

		});
	},
	render: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return (
			<div className="bPageMessage">
				<SVG classes="bLoginIcon" icon="icon_login"/>
				<Form name="Change password" binding={binding} onSubmit={self.submitEdit}>
					<FormField type="confirmText" textType="password" field="newPassword" validation="password required" fieldClassName="mLarge">Password</FormField>
				</Form>
			</div>
		);
	}
});

module.exports = PasswordResetRequestForm;

