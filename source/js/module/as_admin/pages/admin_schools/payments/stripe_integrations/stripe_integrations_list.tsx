import * as React from 'react';
import * as Morearty from 'morearty';
import {Grid} from 'module/ui/grid/grid';

import {StripeIntegrationsModel} from './stripe_integrations_list_model';

export const StripeIntegrationsList = (React as any).createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	binding 	= this.getDefaultBinding(),
				grid 		= binding.toJS('grid');

		if (grid) {
			this.model = new StripeIntegrationsModel(this).createGridFromExistingData(grid);
		} else {
			this.model = new StripeIntegrationsModel(this).createGrid();
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