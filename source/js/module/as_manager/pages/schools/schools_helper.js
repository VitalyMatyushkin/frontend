const schoolConsts = require('./../../../helpers/consts/schools');

const defaultPassValue = '**************';

const SchoolHelper = {
	/**
	 * !!! Method modify arg !!!
	 * Method replace client publicSite.password field value by server value
	 * @param data
	 */
	setServerPublicSiteAccessPasswordValue: function(data) {
		const c = schoolConsts.PUBLIC_SCHOOL_STATUS_CLIENT_TO_SERVER_VALUE;

		if(data.publicSite.status === c.Protected && data.publicSite.password === defaultPassValue){
			delete data.publicSite.password;
		}
	},
	/**
	 * !!! Method modify arg !!!
	 * Method replace server publicSite.password field value by client value
	 * @param data
	 */
	setClientPublicSiteAccessPasswordValue: function(data) {
		const c = schoolConsts.PUBLIC_SCHOOL_STATUS_CLIENT_TO_SERVER_VALUE;

		if(data.publicSite.status === c.Protected){
			data.publicSite.password = defaultPassValue;
		}
	}
};

module.exports = SchoolHelper;