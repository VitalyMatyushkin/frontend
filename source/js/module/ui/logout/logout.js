const 	React 			= require('react'),
		Morearty    	= require('morearty'),
		StorageHelper 	= require('module/helpers/storage'),
		DomainHelper 	= require('module/helpers/domain_helper');

const Logout = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const binding = this.getDefaultBinding();

		// clear authorizationInfo
		StorageHelper.cookie.remove('authorizationInfo');
		binding.sub('authorizationInfo').clear();

		// redirect to login
        window.location.href = DomainHelper.getLoginUrl();

		return null;
	}
});

module.exports = Logout;