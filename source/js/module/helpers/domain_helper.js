/**
 * Created by Anatoly on 29.05.2016.
 */

const 	RoleHelper	= require('module/helpers/role_helper'),
		Storage 	= require('module/helpers/storage');

/**
 * Helper to generate domain names, and cross-domain transitions.
 * */
const DomainHelper = {
	/**
	 * Get new subdomain name
	 * @param {string} domainName - domain name, for ex. 'greatwalstead'
	 * @return {string} new subdomain name, for ex. 'greatwalstead.squard.com:8080'
	 * */
	getSubDomain:function(domainName){
		const subdomains = document.location.host.split('.');
		subdomains[0] = domainName;
		return subdomains.join(".");
	},

	/**
	 * Get login Url for redirect after logout
	 * */
	getLoginUrl:function(){
		let subdomains = document.location.host.split('.');
		subdomains[0] = subdomains[0] !=='admin' ? 'app': subdomains[0];
		const domain = subdomains.join(".");
		return `//${domain}/#login`;
	},

	/**
	 * Redirect to start page after login
	 * */
	redirectToStartPage: function(role) {
		const	domainName	= this.getDomainNameByRole(role),
				defaultPage	= this.getDefaultPageByRoleName(role);

		window.location.href = `//${domainName}/#${defaultPage}`;
		window.location.reload();
	},
	getDefaultPageByRoleName: function(roleName) {
		switch (roleName.toLowerCase()) {
			case 'owner':
				return `school_admin/summary`;
			case 'admin':
				return `school_admin/summary`;
			case 'manager':
				return `school_admin/summary`;
			case 'teacher':
				return `school_admin/summary`;
			case 'trainer':
				return `school_admin/summary`;
			case 'parent':
				return `events/calendar/all`;
			case 'student':
				return `events/calendar/all`;
			case 'no_body':
				return `settings/general`;
		}
	},
	getThirdLevelDomainByRole: function(role) {
		return RoleHelper.roleMapper[role.toLowerCase()];
	},
	getDomainNameByRole: function(role) {
		// parse domains from domain name to array
		// app.squard.com => ['app', 'squard', 'com']
		const domains = document.location.host.split('.');
		// Third level domain is "0" index in array
		domains[0] = this.getThirdLevelDomainByRole(role);

		return domains.join(".");
	}
};

module.exports = DomainHelper;