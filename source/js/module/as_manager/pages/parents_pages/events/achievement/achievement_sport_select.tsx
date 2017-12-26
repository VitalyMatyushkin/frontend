/**
 * Created by vitaly on 22.12.17.
 */

import * as	React from 'react';
import * as	Morearty from 'morearty';
import * as	Immutable from 'immutable';
import {Sport} from 'module/as_admin/pages/admin_schools/school_sandbox/allowed_sports/sport';

export const AchievementSportSelect = (React as any).createClass({
	mixins: [Morearty.Mixin],
	getCurrentSport: function(): Sport {
		return this.getDefaultBinding().toJS('currentAchievementSport');
	},
	
	getSports: function(): React.ReactNode {
		const sports = this.getDefaultBinding().toJS('achievementSports');
		
		return sports.map(sport => {
			return (
				<option
					value	= { sport.id }
					key		= { sport.id }
				>
					{sport.name}
				</option>
			);
		});
	},
	
	handleChangeSport: function(eventDescriptor): void {
		const	sportId	= eventDescriptor.target.value,
				sports	= this.getDefaultBinding().toJS('achievementSports');
		
		const	foundSport	= sports.find(sport => sport.id === sportId);
		
		this.getDefaultBinding().set('currentAchievementSport', Immutable.fromJS(foundSport));
	},
	
	render: function(){
		return (
			<select
				className		= "bDropdown"
				defaultValue	= "not-selected-sport"
				value			= {this.getCurrentSport().id}
				onChange		= {this.handleChangeSport}
			>
				{this.getSports()}
			</select>
		);
	}
});