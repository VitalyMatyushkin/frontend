const 	Logo 		= require('module/as_school/head/logo'),
		TopMenu 	= require('module/ui/menu/public_menu'),
		PublicLogin = require('module/ui/menu/public_login'),
		Morearty    = require('morearty'),
		React 		= require('react');

const Head = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const 	self 	= this,
				binding = this.getDefaultBinding();

		return (
			<div className="bTopPanel schoolPanel mClearFix">
				<Logo />
				<TopMenu menuItems={['school','fixtures','cricket','rounders','rugby','netball','football','hockey']}></TopMenu>
				<PublicLogin />
			</div>
		)
	}
});

module.exports = Head;
