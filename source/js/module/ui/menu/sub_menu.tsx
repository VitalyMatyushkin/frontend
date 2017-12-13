import * as React 		from 'react';
import * as Morearty 	from 'morearty';
import {MenuMixin} 		from 'module/ui/menu/menu_mixin';

export const SubMenu = (React as any).createClass({
	mixins: [Morearty.Mixin, MenuMixin],
	itemClassName: 'eSubMenu_item ',
	render: function() {
		return (
			<div className="bSubMenu mClearFix">
				{this.getMenuNodes()}
			</div>
		)
	}
});
