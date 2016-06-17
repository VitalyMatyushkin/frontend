/**
 * Created by Anatoly on 29.05.2016.
 */

const 	RoleHelper	= require('module/helpers/role_helper'),
		Storage 	= require('module/helpers/storage');


const DomainHelper = {
	getLoginUrl:function(){
		let subdomains = document.location.host.split('.');
		subdomains[0] = subdomains[0] !=='admin' ? 'login': subdomains[0];
		const domain = subdomains.join(".");
		return `//${domain}/#login`;
	},
	redirectToStartPage: function(roleName) {
		const roleSubdomain = RoleHelper.roleMapper[roleName.toLowerCase()];

		if(roleSubdomain) {
			let subdomains = document.location.host.split('.');

			if(subdomains[0] !== roleSubdomain){
				subdomains[0] = roleSubdomain;
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
			window.location.reload();
		} else {
			alert('unknown role: ' + roleName);
		}
	}

};

module.exports = DomainHelper;
