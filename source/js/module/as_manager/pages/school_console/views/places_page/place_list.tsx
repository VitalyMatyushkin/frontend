import * as React from 'react'
import * as Morearty from 'morearty'
import * as Immutable from 'immutable'

import {Grid} from 'module/ui/grid/grid'
import {PlaceListClass} from './place_list_class'

export const PlaceList = (React as any).createClass({
	mixins: [Morearty.Mixin],

	componentWillMount() {
		const binding = this.getDefaultBinding();
		const grid = binding.toJS('grid');

		const placeListClassInstance = new PlaceListClass(this);
		if (grid) {
			this.model = placeListClassInstance.createGridFromExistingData(grid);
		} else {
			this.model = placeListClassInstance.createGrid();
		}
	},
	render() {
		const binding = this.getDefaultBinding();
		
		binding.set('grid', Immutable.fromJS(this.model.grid));
		return this.model.grid ? <Grid model={this.model.grid}/> : null;
	}
});