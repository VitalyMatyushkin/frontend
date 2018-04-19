import * as React from 'react';
import * as Morearty from 'morearty';
import {Grid} from 'module/ui/grid/grid';

import {PaymentAccountModel} from './payments_accounts_list_model';

export const AccountsList = (React as any).createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	binding 	= this.getDefaultBinding(),
			grid 		= binding.toJS('grid');

		if (grid) {
			this.model = new PaymentAccountModel(this).createGridFromExistingData(grid);
		} else {
			this.model = new PaymentAccountModel(this).createGrid();
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