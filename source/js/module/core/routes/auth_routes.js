const 	Morearty    			= require('morearty'),
		React 					= require('react'),
		Route 					= require('module/core/route'),
		RegisterUserComponent 	= require('module/ui/register/user'),
		LoginUserComponent		= require('module/ui/login/user'),
		LogoutUserComponent		= require('module/ui/logout/logout'),
		RegisterDoneComponent	= require('module/ui/register/user/register_done');

const AuthRoutes = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		path: 				React.PropTypes.string.isRequired,
		component: 			React.PropTypes.object.isRequired,
		pageName: 			React.PropTypes.string,
		loginRoute: 		React.PropTypes.bool,
		verifyRoute: 		React.PropTypes.bool,
		unauthorizedAccess: React.PropTypes.bool
	},
	render: function() {
		const 	self 	= this,
				binding = self.getDefaultBinding();

		return (
			<span>
				<Route path="/register"  	binding={binding.sub('form.register')} 	component={RegisterUserComponent} 	unauthorizedAccess={true}  />
				<Route path="/login" 		binding={binding.sub('userData')} 		component={LoginUserComponent} 		loginRoute={true}  />
				<Route path="/logout" 		binding={binding.sub('userData')} 		component={LogoutUserComponent} 	unauthorizedAccess={true}  />
				<Route path="/verify"  		binding={binding.sub('userData')} 		component={RegisterDoneComponent} 	verifyRoute={true}  />
			</span>
		)
	}
});

module.exports = AuthRoutes;

