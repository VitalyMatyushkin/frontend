// @flow

const 	React			= require('react'),
		Morearty 		= require('morearty'),
		SVG 			= require('module/ui/svg'),
		DomainHelper	= require('module/helpers/domain_helper'),
		RoleHelper		= require('module/helpers/role_helper');

const Logo = React.createClass({
	mixins: [Morearty.Mixin],

	render: function () {
		/**
		 * TODO Fix it. We must get role from RoleHelper
		 * @type {string}
		 */
		const role = typeof this.getMoreartyContext().getBinding().toJS('userData.authorizationInfo.role') !== 'undefined'
			? this.getMoreartyContext().getBinding().toJS('userData.authorizationInfo.role')
			: '';
		return (
			<div className="bTopLogo" onClick={() => DomainHelper.redirectToSettingsPage()}>
				<img src="images/logo.svg"/>
			</div>
		)
	}
});

module.exports = Logo;
