import * as React from 'react';
import * as Morearty from 'morearty';
import {BlogsModel} from './blogs_list_model';
import {Grid} from 'module/ui/grid/grid';

export const BlogsList = (React as any).createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	binding 	= this.getDefaultBinding(),
				grid 		= binding.toJS('grid');

		if (grid) {
			this.model = new BlogsModel(this).createGridFromExistingData(grid);
		} else {
			this.model = new BlogsModel(this).createGrid();
		}
	},
	render: function () {
		return (
			<div className="bSchoolMaster">
				<Grid model={this.model.grid}/>
			</div>
		);
	}
});