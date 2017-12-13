// @flow

import * as React 		from 'react';
import * as Morearty 	from 'morearty';
import {MenuMixin} 		from 'module/ui/menu/menu_mixin';

export const TopMenu = (React as any).createClass({
	mixins: [Morearty.Mixin, MenuMixin],
	itemClassName: 'eTopMenu_item ',
	render: function() {
		return (
			<div className="bTopMenu">
				{this.getMenuNodes()}
			</div>
		)
	}
});