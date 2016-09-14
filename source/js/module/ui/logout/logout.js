const 	React 			= require('react'),
		Auth			= require('module/core/services/AuthorizationServices'),
		DomainHelper 	= require('module/helpers/domain_helper');

const Logout = function() {
	// clear authorizationInfo
	Auth.clear();
	
	// redirect to login
	window.location.href = DomainHelper.getLoginUrl();

	return null;
};

module.exports = Logout;