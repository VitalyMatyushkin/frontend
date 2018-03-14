import * as React from 'react'
import * as Morearty from 'morearty'

import {DashboardCard} from "module/ui/dashboard_components/main_components/dashboard_card/dashboard_card";
import {DashboardSchoolProfileWidget} from "module/ui/dashboard_components/dashboard_school_profile_widget/dashboard_school_profile_widget";

import 'styles/ui/dashboard/dashboard_main_page.scss'

export const DashboardMainPage = (React as any).createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: (React as any).PropTypes.string.isRequired
	},
	render() {
		return (
			<div className="bDashboardMainPage">
				<div className='eDashboardMainPage_mainContainer'>
					<DashboardCard
						bootstrapWidth={3}
						headerText='School Profile'
					>
						<DashboardSchoolProfileWidget school={{name: 'GreatWalsteadSchool'}}/>
					</DashboardCard>
				</div>
			</div>
		);
	}
});