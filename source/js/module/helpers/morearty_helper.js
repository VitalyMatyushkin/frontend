const SessionHelper = require('module/helpers/session_helper');

/**
 * Return active school id
 * @param self - context(this) of react element that include morearty mixin
 */
function getActiveSchoolId(self) {
    return self.getMoreartyContext().getBinding().get('userRules.activeSchoolId');
}

/**
 * Return ID of logged in user
 * @param self - context(this) of react element that include morearty mixin
 */
function getLoggedInUserId(self) {
	return SessionHelper.getUserIdFromSession(
		self.getMoreartyContext().getBinding().sub('userData')
	);
}

const MoreartyHelper = {
	getActiveSchoolId:  getActiveSchoolId,
	getLoggedInUserId:  getLoggedInUserId
}

module.exports = MoreartyHelper;