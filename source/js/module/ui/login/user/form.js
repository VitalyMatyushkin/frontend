const 	Form 		= require('module/ui/form/form'),
		FormField 	= require('module/ui/form/form_field'),
		React 		= require('react'),
        Auth        = require('module/core/services/AuthorizationServices');

const LoginUserForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onSuccess: 	React.PropTypes.func,
		onError: 	React.PropTypes.func,
		customName: React.PropTypes.string
	},
	componentWillMount:function(){
		const self = this;
		self.tmpFormName = self.props.customName === 'default'? self.props.customName = "Sign in or <a class='mHover' href='/#register'>join us for free</a>" : self.props.customName;
	},

	render: function() {
		const 	self 	= this,
				binding = self.getDefaultBinding();

		return (
			<Form name={self.tmpFormName} service={Auth.login} binding={self.getDefaultBinding()} onSuccess={self.props.onSuccess} onError={self.props.onError}>
				<FormField type="text" placeholder="E-mail" htmlId="login_input" field="email" validation="email required" />
				<FormField type="text" textType="password" placeholder="Password" htmlId="password_input" field="password" validation="required" binding={binding}/>
			</Form>
		)
	}
});


module.exports = LoginUserForm;
