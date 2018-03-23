import * as React from 'react';

import {DashboardSchoolProfileComplete} from "module/ui/dashboard_components/dashboard_school_profile_widget/components/dashboard_school_profile_complete";

import 'styles/ui/dashboard/dashboard_school_profile_widget/dashboard_school_profile_widget.scss'
import {DashboardButton} from "module/ui/dashboard_components/main_components/dashboard_button/dashboard_button";

export interface DashboardSchoolProfileWidgetProps {
	school: any
}

const REQUIRED_FIELDS = [
	'pic', 'email', 'sportsDepartmentEmail',
	'name', 'description',
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

		return schoolProfileCompletePercents;
	}
	render() {
		return (
			<div className='bDashboardSchoolProfileWidget'>
				<DashboardSchoolProfileComplete profileCompletePercent={this.getSchoolProfileCompletePercents()}/>
				<div className='eDashboardSchoolProfileWidget_body'>
					<div className='eDashboardSchoolProfileWidget_button'>
						<DashboardButton
							handleClick={() => this.handleClick()}
							text='More Information'
						/>
					</div>
				</div>
			</div>
		);
	}
}