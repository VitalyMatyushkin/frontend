import * as React from 'react';

import {DashboardSchoolProfileComplete} from "module/ui/dashboard_components/dashboard_school_profile_widget/components/dashboard_school_profile_complete";

import 'styles/ui/dashboard/dashboard_school_profile_widget/dashboard_school_profile_widget.scss'
import {DashboardInfoButton} from "module/ui/dashboard_components/main_components/dashboard_info_button/dashboard_info_button";

export interface DashboardSchoolProfileWidgetProps {
	school: any
}

const REQUIRED_FIELDS = [
	'pic', 'email', 'sportsDepartmentEmail',
	'notificationEmail', 'name', 'description',
	'phone', 'postcodeId', 'address'
];

export class DashboardSchoolProfileWidget extends React.Component<DashboardSchoolProfileWidgetProps, {}> {
	handleClick() {
		window.location.hash = `schools/edit?id=${this.props.school.id}`;
	}
	getSchoolProfileCompletePercents() {
		let schoolProfileCompletePercents = 0;

		// get count of filled fields
		let filledFields = 0;
		REQUIRED_FIELDS.forEach(field => {
			if(typeof this.props.school[field] !== 'undefined') {
				filledFields++;
			}
		});

		// get percent of filled fields from all fields
		if(filledFields !== 0) {
			const exactPercents = Math.floor(filledFields/REQUIRED_FIELDS.length * 100);
			// up round percents
			const tmp = Math.floor(exactPercents / 10);
			if(tmp === 0) {
				schoolProfileCompletePercents = 10;
			} else {
				schoolProfileCompletePercents = tmp * 10;
			}
		}

		console.log(schoolProfileCompletePercents);
		return schoolProfileCompletePercents;
	}
	render() {
		return (
			<div className='bDashboardSchoolProfileWidget'>
				<DashboardSchoolProfileComplete profileCompletePercent={this.getSchoolProfileCompletePercents()}/>
				<div className='eDashboardSchoolProfileWidget_body'>
					<DashboardInfoButton
						handleClick={() => this.handleClick()}
						bootstrapWidth={12}
						text='More Information'
					/>
				</div>
			</div>
		);
	}
}