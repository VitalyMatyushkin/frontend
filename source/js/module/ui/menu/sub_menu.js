var SubMenu,
	Mixin = require('module/ui/menu/menu_mixin');

SubMenu = React.createClass({
	mixins: [Morearty.Mixin, Mixin],
	itemClassName: 'eSubMenu_item ',
	render: function() {
		var self = this;

		return (
			<div className="bSubMenu mClearFix">
				{self.getMenuNodes()}
			</div>
		)
	}
});

module.exports = SubMenu;

