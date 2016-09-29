const schoolConsts = require('./../../../helpers/consts/schools');

const SchoolHelper = {
	/**
	 * !!! Method modify arg !!!
	 * Method replace client publicSite.status field value by server value
	 * @param dataToPost
	 */
	setServerPublicAccessSchoolValue: function(dataToPost) {
		dataToPost.publicSite.status = schoolConsts.PUBLIC_SCHOOL_STATUS_CLIENT_TO_SERVER_VALUE[dataToPost.publicSite.status];
	},
	/**
	 * !!! Method modify arg !!!
	 * Method replace client publicSite.status field value by server value
	 * @param dataToPost
	 */
	setClientPublicAccessSchoolValue: function(dataToPost) {
		dataToPost.publicSite.status = schoolConsts.PUBLIC_SCHOOL_STATUS_SERVER_TO_CLIENT_VALUE[dataToPost.publicSite.status];
	}
};

module.exports = SchoolHelper;