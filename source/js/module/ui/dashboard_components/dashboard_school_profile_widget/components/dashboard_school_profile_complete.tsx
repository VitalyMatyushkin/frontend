import * as React from 'react';

import 'styles/ui/dashboard/dashboard_school_profile_widget/dashboard_school_profile_complete.scss'

export interface DashboardSchoolProfileCompleteProps {
	profileCompletePercent: number
}

export class DashboardSchoolProfileComplete extends React.Component<DashboardSchoolProfileCompleteProps, {}> {
	render() {
		return (
			<div className='bDashboardSchoolProfileComplete'>
				<div className='eDashboardSchoolProfileComplete_col'>
					<h1 className='eDashboardSchoolProfileComplete_percentComplete'>
						{this.props.profileCompletePercent}%
					</h1>
					<h6 className='eDashboardSchoolProfileComplete_text'>
						Profile Completed
					</h6>
				</div>
				<div className='eDashboardSchoolProfileComplete_col mTextRight'>
					<div
						data-label={`${this.props.profileCompletePercent}%`}
						className={`eDashboardSchoolProfileComplete_donutProgressBar mProgress-${this.props.profileCompletePercent}`}
					>
						<i className='eDashboardSchoolProfileComplete_donutProgressBarCircle'>
						</i>
					</div>
				</div>
			</div>
		);
	}
}