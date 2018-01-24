import * as	React from 'react'
import * as	Immutable from 'immutable'
import * as	Morearty from 'morearty'

import {Grid} from 'module/ui/grid/grid'
import {ClubListModel} from 'module/as_manager/pages/clubs/club_list/club_list_model'

export const ClubList = (React as any).createClass({
	mixins: [Morearty.Mixin],

	componentWillMount() {
		const binding = this.getDefaultBinding();
		const grid = binding.toJS('grid');

		const clubListModel = new ClubListModel(this);
		if (grid) {
			this.model = clubListModel.createGridFromExistingData(grid);
		} else {
			this.model = clubListModel.createGrid();
		}
	},
	render() {
		const binding = this.getDefaultBinding();

		binding.set('grid', Immutable.fromJS(this.model.grid));

		return (
			<div className="bSchoolMaster">
				{ this.model.grid ? <Grid model={this.model.grid} id="clubs_table"/> : null }
			</div>
		);
	}
});