/**
 * Created by vitaly on 04.12.17.
 */

import * as React from 'react';
import * as Morearty from 'morearty';
import {TournamentsModel} from 'module/as_manager/pages/tournaments/tournaments-model';
import {Grid} from 'module/ui/grid/grid';

export const TournamentsList = (React as any).createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	binding 	= this.getDefaultBinding(),
				grid 		= binding.toJS('grid');

		if (grid) {
			this.model = new TournamentsModel(this).createGridFromExistingData(grid);
		} else {
			this.model = new TournamentsModel(this).createGrid();
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
