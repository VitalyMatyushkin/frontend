// @flow

const 	React			= require('react'),
		Morearty 		= require('morearty'),
		DomainHelper	= require('module/helpers/domain_helper');

const Logo = React.createClass({
	mixins: [Morearty.Mixin],
	render: function () {
		return (
			<div
				className	= "bTopLogo"
				onClick		= { DomainHelper.redirectToSettingsPage.bind(DomainHelper) }
			>
				<img src="images/logo.svg"/>
			</div>
		)
	}
});

module.exports = Logo;
