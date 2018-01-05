/**
 * Created by vitaly on 04.01.18.
 */

import * as React from 'react';
import * as Morearty from 'morearty';
import * as	Immutable from 'immutable';
import {Grid} from 'module/ui/grid/grid';
import {ActionDescriptorsModel} from './action-descriptors-model';

export const ActionDescriptors = (React as any).createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	binding 	= this.getDefaultBinding(),
				grid 		= binding.toJS('gridActionDescriptors');
		
		if (grid) {
			this.model = new ActionDescriptorsModel(this).createGridFromExistingData(grid);
		} else {
			this.model = new ActionDescriptorsModel(this).createGrid();
		}
	},
	
	render: function () {
		const binding = this.getDefaultBinding();
		binding.set('gridActionDescriptors', Immutable.fromJS(this.model.grid));
		
		return <Grid model={this.model.grid}/>;
	}
});
