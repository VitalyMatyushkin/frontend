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
		const self = this;

		let schoolProfileCompletePercents = 0;

		// get count of filled fields
		let filledFields = 0;
		REQUIRED_FIELDS.forEach(field => {
			switch (true) {
				case typeof self.props.school[field] === 'string' && self.props.school[field] !== '': {
					filledFields++;
					break;
				}
				case typeof self.props.school[field] !== 'string' && typeof self.props.school[field] !== 'undefined': {
					filledFields++;
					break;
				}
			}
		});

		switch (true) {
			case filledFields === 0: {
				schoolProfileCompletePercents = 0;
				break;
			}
			case filledFields === REQUIRED_FIELDS.length: {
				schoolProfileCompletePercents = 100;
				break;
			}
			default: {
				schoolProfileCompletePercents = Math.floor(filledFields/REQUIRED_FIELDS.length * 100);
				break;
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