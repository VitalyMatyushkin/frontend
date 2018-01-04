/**
 * Created by vitaly on 04.01.18.
 */

import * as React from 'react';
import * as Morearty from 'morearty';
import {Grid} from 'module/ui/grid/grid';
import {ActionDescriptorsModel} from './action-descriptors-model';

export const ActionDescriptors = (React as any).createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	binding 	= this.getDefaultBinding(),
				grid 		= binding.toJS('data');
		
		if (grid) {
			this.model = new ActionDescriptorsModel(this).createGridFromExistingData(grid);
		} else {
			this.model = new ActionDescriptorsModel(this).createGrid();
		}
	},
	
	render: function () {
		return <Grid model={this.model.grid}/>;
	}
});
