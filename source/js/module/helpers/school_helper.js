/**
 * Created by Anatoly on 12.12.2016.
 */

const Immutable = require('immutable');

const schoolConsts = require('./consts/schools');

const defaultPassValue = '**************';

const SchoolHelper = {
	/**
	 * Return active school id
	 * @param self - context(this) of react element that include morearty mixin
	 */
	getActiveSchoolId: function(self) {
		return self.getMoreartyContext().getBinding().get('userRules.activeSchoolId');
	},

	/**
	 * Return active school data
	 * @param self - context(this) of react element that include morearty mixin
	 */
	getActiveSchoolInfo: function (self) {
		const
			rootBinding = self.getMoreartyContext().getBinding(),
			activeSchoolInfo = rootBinding.toJS('activeSchool.schoolInfo');

		return activeSchoolInfo;
	},

	/**
	 * Return active school data
	 * @param self - context(this) of react element that include morearty mixin
	 */
	loadActiveSchoolInfo: function (self) {
		const
			rootBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = rootBinding.toJS('userRules.activeSchoolId');

		return window.Server.school.get(activeSchoolId).then(data => {
			rootBinding.set('activeSchool.schoolInfo', Immutable.fromJS(data));

			return data;
		})
	},

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