import * as React from 'react';

import {DashboardSchoolProfileComplete} from "module/ui/dashboard_components/dashboard_school_profile_widget/components/dashboard_school_profile_complete";

import 'styles/ui/dashboard/dashboard_school_profile_widget/dashboard_school_profile_widget.scss'
import {DashboardInfoButton} from "module/ui/dashboard_components/main_components/dashboard_info_button/dashboard_info_button";

export interface School {
	id: string,
	name: string
}

export interface DashboardSchoolProfileWidgetProps {
	school: any
}

export class DashboardSchoolProfileWidget extends React.Component<DashboardSchoolProfileWidgetProps, {}> {
	render() {
		return (
			<div className='bDashboardSchoolProfileWidget'>
				<DashboardSchoolProfileComplete profileCompletePercent={78}/>
				<div className='eDashboardSchoolProfileWidget_body'>
					<DashboardInfoButton
						bootstrapWidth={12}
						text='More Information'
					/>
				</div>
			</div>
		);
	}
}