/**
 * Created by vitaly on 05.01.18.
 */

import * as React from 'react';
import * as Morearty from 'morearty';
import {Grid} from 'module/ui/grid/grid';
import {NotificationsModel} from './notifications-model';

export const NotificationTable = (React as any).createClass({
	mixins: [Morearty.Mixin],
	
	componentWillMount: function () {
		this.model = new NotificationsModel(this).init();
	},
	
	render: function () {
		return <Grid model={this.model.grid}/>;
	}
});


