var AuthRoutes,
	React = require('react'),
	Route = require('module/core/route');

AuthRoutes = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		path: React.PropTypes.string.isRequired,
		component: React.PropTypes.string.isRequired,
		pageName: React.PropTypes.string,
		loginRoute: React.PropTypes.bool,
		verifyRoute: React.PropTypes.bool,
		unauthorizedAccess: React.PropTypes.bool
	},
	render: function() {
		var self = this;

		return (
			<span>
				<Route path="/register"  binding={binding.sub('form.register')} component="module/ui/register/user" unauthorizedAccess={true}  />
				<Route path="/login" binding={binding.sub('userData')} component="module/ui/login/user" loginRoute={true}  />
				<Route path="/logout" binding={binding.sub('userData')} component="module/ui/logout/logout" unauthorizedAccess={true}  />
				<Route path="/verify"  binding={binding.sub('userData')} component="module/ui/register/user/register_done" verifyRoute={true}  />
			</span>
		)
	}
});

module.exports = AuthRoutes;

