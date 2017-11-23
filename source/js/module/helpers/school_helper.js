
/**
 * Created by Anatoly on 12.12.2016.
 */

const 	Immutable	= require('immutable'),
		Promise		= require('bluebird');

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
		const	rootBinding			= self.getMoreartyContext().getBinding(),
				activeSchoolInfo	= rootBinding.toJS('activeSchool.schoolInfo');

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

			return Promise.resolve(data);
		})
	},
	
	/**
	 * Return active school data (public)
	 * @param self - context(this) of react element that include morearty mixin
	 */
	loadActiveSchoolInfoPublic: function (self) {
		const	rootBinding		= self.getMoreartyContext().getBinding(),
				activeSchoolId 	= rootBinding.toJS('userRules.activeSchoolId');

		return window.Server.publicSchool.get(activeSchoolId).then( data => {
			rootBinding.set('activeSchool.schoolInfo', Immutable.fromJS(data));

			return Promise.resolve(data);
		})

	},

	setSchoolSubscriptionPlanPromise: function (self) {
		const binding = self.getDefaultBinding();

		return this.loadActiveSchoolInfo(self).then(data => {
			binding.set('schoolSubscriptionPlan', data.subscriptionPlan);

			return Promise.resolve(data);
		});

	},

	schoolSubscriptionPlanIsFull: function (self) {
		const 	binding				= self.getDefaultBinding(),
				subscriptionPlan	= binding.get('schoolSubscriptionPlan');

		if(subscriptionPlan === schoolConsts.SCHOOL_SUBSCRIPTION_PLAN.LITE){
			window.simpleAlert(
				'This feature is not available in your current subscription plan. To be able to manage students you need to upgrade your subscription.',
				'Ok',
				() => {}
			)
		}

		return subscriptionPlan === schoolConsts.SCHOOL_SUBSCRIPTION_PLAN.FULL;
	},

	/**
	 * !!! Method modify arg !!!
	 * Method replace client publicSite.password field value by server value
	 * @param data
	 */
	setServerPublicSiteAndBigscreenAccessPasswordValue: function(data) {
		const c = schoolConsts.PUBLIC_SCHOOL_STATUS_CLIENT_TO_SERVER_VALUE;

		if(data.publicSite.status === c.Protected && data.publicSite.password === defaultPassValue){
			delete data.publicSite.password;
		}
		if(data.publicBigscreenSite.status === c.Protected && data.publicBigscreenSite.password === defaultPassValue){
			delete data.publicBigscreenSite.password;
		}
	},
	/**
	 * !!! Method modify arg !!!
	 * Method replace server publicSite.password field value by client value
	 * @param data
	 */
	setClientPublicSiteAndBigscreenAccessPasswordValue: function(data) {
		const c = schoolConsts.PUBLIC_SCHOOL_STATUS_CLIENT_TO_SERVER_VALUE;

		if(data.publicSite.status === c.Protected){
			data.publicSite.password = defaultPassValue;
		}
		if(data.publicBigscreenSite.status === c.Protected){
			data.publicBigscreenSite.password = defaultPassValue;
		}
	}
};

module.exports = SchoolHelper;