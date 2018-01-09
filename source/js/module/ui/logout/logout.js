const React = require('react');

const {AuthorizationServices} = require('module/core/services/AuthorizationServices');
const DomainHelper = require('module/helpers/domain_helper');

const Logout = function() {
	// clear authorizationInfo
	AuthorizationServices.clear();
	
	// redirect to login
	window.location.href = DomainHelper.getLoginUrl();
	window.location.reload();

	return null;
};

module.exports = Logout;