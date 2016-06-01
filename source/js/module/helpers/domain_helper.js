/**
 * Created by Anatoly on 29.05.2016.
 */

const DomainHelper = {
	getLoginUrl:function(){
		let subdomains = document.location.host.split('.');
		subdomains[0] = subdomains[0] !=='admin' ? 'login': subdomains[0];
		const domain = subdomains.join(".");
		return `http://${domain}/#login`;
	}
};

module.exports = DomainHelper;
