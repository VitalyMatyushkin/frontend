const 	Logo 		= require('module/as_school/head/logo'),
		TopMenu 	= require('module/ui/menu/public_menu'),
		Morearty    = require('morearty'),
		React 		= require('react');

const Head = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const 	self 	= this,
				binding = this.getDefaultBinding();

		return (
			<div className="bTopPanel schoolPanel">
                <TopMenu menuItems={['school','fixtures','cricket','rounders','rugby','netball','football','hockey']}></TopMenu>
				<Logo />

			</div>
		)
	}
});

module.exports = Head;
