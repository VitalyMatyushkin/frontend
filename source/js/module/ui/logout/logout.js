const 	React 		= require('react'),
		Morearty    = require('morearty'),
		Helpers 	= require('module/helpers/storage');

const LoginUserPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const binding = this.getDefaultBinding();

		Helpers.cookie.remove('authorizationInfo');
		binding.sub('authorizationInfo').clear();
        let subdomains = document.location.host.split('.');
        subdomains[0] = subdomains[0] !=='admin' ? 'login': subdomains[0];
        const domain = subdomains.join(".");
        window.location.href = `//${domain}/#login`;

		return null;
	}
});

module.exports = LoginUserPage;