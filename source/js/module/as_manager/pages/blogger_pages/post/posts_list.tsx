import * as React from 'react';
import * as Morearty from 'morearty';
import {PostsModel} from './posts_list_model';
import {Grid} from 'module/ui/grid/grid';

export const PostsList = (React as any).createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	binding 	= this.getDefaultBinding(),
				grid 		= binding.toJS('grid');

		if (grid) {
			this.model = new PostsModel(this).createGridFromExistingData(grid);
		} else {
			this.model = new PostsModel(this).createGrid();
		}
	},
	render: function () {
		return (
			<div className="bSchoolMaster">
				<Grid model={this.model.grid} region={this.props.region}/>
			</div>
		);
	}
});