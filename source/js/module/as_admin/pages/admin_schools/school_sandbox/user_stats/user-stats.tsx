/**
 * Created by vitaly on 19.12.17.
 */

import * as React from 'react';
import * as Morearty from 'morearty';
import {UserStatsModel} from './user-stats-model';
import {Grid} from 'module/ui/grid/grid';
import {ConfirmPopup} from 'module/ui/confirm_popup';

export const UserStats = (React as any).createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const	binding	= this.getDefaultBinding();
		binding.set('isShowCSVExportPopup', false);
		
		this.model = new UserStatsModel(this).init();
	},
	
	renderCSVExportPopup: function () {
		const binding = this.getDefaultBinding();
		
		if(binding.get('isShowCSVExportPopup')) {
			return (
				<ConfirmPopup
					isShowButtons = { false }
				>
					<div
						className = 'bCSVExportPopup'
					>
						Loading data. It will take some time.
					</div>
				</ConfirmPopup>
			);
		} else {
			return null;
		}
	},
	
	render: function () {
		return (
			<div>
				<Grid model={this.model.grid}/>
				{ this.renderCSVExportPopup() }
			</div>
		);
	}
});
