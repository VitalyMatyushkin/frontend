const 	React 		= require('react'),
		MenuMixin 	= require('module/ui/menu/menu_mixin');

const SubMenu = React.createClass({
	mixins: [Morearty.Mixin, MenuMixin],
	itemClassName: 'eSubMenu_item ',
	render: function() {
		const self = this;
		return (
			<div className="bSubMenu mClearFix">
				{self.getMenuNodes()}
			</div>
		)
	}
});

module.exports = SubMenu;

