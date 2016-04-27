const 	React 	= require('react'),
		Helpers = require('module/helpers/storage');

const LoginUserPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const binding = this.getDefaultBinding();

		//window.Server.logout.post();
		Helpers.cookie.remove('authorizationInfo');
		binding.sub('authorizationInfo').clear();
        let subdomains = document.location.host.split('.');
        subdomains[0] = 'login';
        const domain = subdomains.join(".");
        window.location.href = `http://${domain}/#login`;
		//window.location.reload(true);
		return null;
	}
});

module.exports = LoginUserPage;