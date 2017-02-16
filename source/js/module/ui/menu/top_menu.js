// @flow

const 	React 		= require('react'),
		Morearty    = require('morearty'),
		Mixin 		= require('module/ui/menu/menu_mixin');

const TopMenu = React.createClass({
	mixins: [Morearty.Mixin, Mixin],
	itemClassName: 'eTopMenu_item ',
	render: function() {
		return (
			<div className="bTopMenu">
				{this.getMenuNodes()}
			</div>
		)
	}
});

module.exports = TopMenu;

