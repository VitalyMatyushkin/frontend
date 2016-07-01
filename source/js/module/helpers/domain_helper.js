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
		subdomains[0] = subdomains[0] !=='admin' ? 'login': subdomains[0];
		const domain = subdomains.join(".");
		return `//${domain}/#login`;
	},

	/**
	 * Redirect to start page after login
	 * */
	redirectToStartPage: function(roleName) {
		const roleSubdomain = RoleHelper.roleMapper[roleName.toLowerCase()];

		if(roleSubdomain) {
			let subdomains = document.location.host.split('.'),
				needReload = true;

			if(subdomains[0] !== roleSubdomain){
				subdomains[0] = roleSubdomain;
				needReload = false;
				/** Save authorizationInfo in cookies */
				let authorizationInfo = Storage.SessionStorage.get('authorizationInfo');
				authorizationInfo && Storage.cookie.set('authorizationInfo', authorizationInfo);
			}
			const domain = subdomains.join(".");
			let newUrl = window.location.href;
			switch (roleSubdomain) {
				case 'manager':
					newUrl = `//${domain}/#school_admin/summary`;
					break;
				case 'parents':
					newUrl = `//${domain}/#events/calendar/all`;
					break;
			}
			window.location = newUrl;
			if(needReload) {
				window.location.reload();
			}
		} else {
			alert('unknown role: ' + roleName);
		}
	}

};

module.exports = DomainHelper;
