var TopMenu,
	React = require('react'),
	Mixin = require('module/ui/menu/menu_mixin');

TopMenu = React.createClass({
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

