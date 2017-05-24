const 	HeadView		= require('module/as_school/head'),
		CenterView		= require('module/as_school/center'),
		Morearty		= require('morearty'),
		React			= require('react'),
		SchoolConsts 	= require('module/helpers/consts/schools'),
		LoginPublicSchoolPage	= require('module/as_school/pages/school_home/login_public_school_page');


const ApplicationView = React.createClass({
	mixins: [Morearty.Mixin],

	/**
	 * Function return true, if public school domain not disabled.
	 * True will be returned for both public and protected cases
	 * @returns {boolean}
	 */
	isPublicSchoolDomainDisabled: function(){
		const publicSiteStatus = this.getMoreartyContext().getBinding().toJS('activeSchool.publicSite.status');
		return publicSiteStatus !== SchoolConsts.PUBLIC_SCHOOL_STATUS_SERVER['DISABLED'];
	},

	render: function() {
		const binding = this.getDefaultBinding();

		if(this.isPublicSchoolDomainDisabled()) {
			return (
				<div>
					<HeadView binding={binding} />
					<CenterView binding={binding} />
				</div>
			);
		} else {
			// TODO: need to show 404 page here
			return null;
		}


	}
});


module.exports = ApplicationView;