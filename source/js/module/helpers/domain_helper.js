// @flow
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
	getSubDomain:function(domainName) {
		const subdomains = document.location.host.split('.');
		subdomains[0] = domainName;
		return subdomains.join(".");
	},

	/**
	 * Get login Url for redirect after logout
	 * */
	getLoginUrl:function() {
		let subdomains = document.location.host.split('.');
		subdomains[0] = subdomains[0] !=='admin' ? 'app': subdomains[0];
		const domain = subdomains.join(".");
		return `//${domain}/#login`;
	},

	/**
	 * Redirect to start page after login
	 * */
	redirectToStartPage: function(role, schoolKind) {
		const	domainName	= this.getDomainNameByRole(role),
				defaultPage	= this.getDefaultPageByRoleNameAndSchoolKind(role, schoolKind);

		window.location.href = `//${domainName}/#${defaultPage}`;
		window.location.reload();
	},

	getDefaultPageByRoleNameAndSchoolKind: function(roleName, schoolKind) {
		const _roleName = roleName.toLowerCase();

		switch (true) {
			case _roleName === 'no_body':
				return `settings/general`;
			case _roleName === 'owner' && schoolKind === 'School':
				return `events/calendar`;
			case _roleName === 'admin' && schoolKind === 'School':
				return `events/calendar`;
			case _roleName === 'manager' && schoolKind === 'School':
				return `events/calendar`;
			case _roleName === 'teacher' && schoolKind === 'School':
				return `events/calendar`;
			case _roleName === 'coach' && schoolKind === 'School':
				return `events/calendar`;
			case _roleName === 'parent' && schoolKind === 'School':
				return `events/calendar/all`;
			case _roleName === 'public_blogger':
				return `blogs`;
			case _roleName === 'student' && schoolKind === 'School':
				return `events/calendar/all`;
			case _roleName === 'admin' && schoolKind === 'SchoolUnion':
				return `school_union_admin/summary`;
			default:
				throw Error(`No role mapping for ${roleName}`);
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
	},
	redirectToSettingsPage: function() {
		this.redirectToStartPage('no_body', undefined);
	}
};

module.exports = DomainHelper;