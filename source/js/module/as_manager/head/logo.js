const 	React 		= require('react'),
		Morearty 		= require('morearty'),
		SVG 			= require('module/ui/svg'),
		DomainHelper	= require('module/helpers/domain_helper'),
		RoleHelper		= require('module/helpers/role_helper');

const Logo = React.createClass({
	mixins: [Morearty.Mixin],

	render: function () {
		const role = typeof this.getMoreartyContext().getBinding().toJS('userData.authorizationInfo.role') !== 'undefined'
			? this.getMoreartyContext().getBinding().toJS('userData.authorizationInfo.role')
			: '';
		return (
			<div className="bTopLogo" onClick={() => DomainHelper.redirectToStartPage(role)}>
				<img src="images/logo.svg"/>
			</div>
		)
	}
});

module.exports = Logo;
