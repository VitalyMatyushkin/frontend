const 	React 		= require('react'),
		Morearty    = require('morearty'),
		Mixin 		= require('module/ui/menu/menu_mixin');

const TopMenu = React.createClass({
	mixins: [Morearty.Mixin, Mixin],
	itemClassName: 'eTopMenu_item ',
	render: function() {
		var self = this;

		return (
			<div className="bTopMenu">
				{self.getMenuNodes()}
			</div>
		)
	}
});

module.exports = TopMenu;

