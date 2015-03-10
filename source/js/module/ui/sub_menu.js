var SubMenu;

SubMenu = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultProps: function () {
		return {
			items: []
		};
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			currentPath = binding.get('currentPath'),
			MenuItemsViews = null;

		MenuItemsViews = self.props.items.map(function(item) {
			var itemPath = item.href.replace('#', ''),
				className = 'eSubMenu_item ';

			if (currentPath && currentPath.indexOf(itemPath) !== -1) {
				className += 'mActive';
			}

			return (
				<a href={item.href} key={item.key} className={className}>{item.name}</a>
			);
		});

		return (
			<div className="bSubMenu mClearFix">
				{MenuItemsViews}
			</div>
		)
	}
});

module.exports = SubMenu;

