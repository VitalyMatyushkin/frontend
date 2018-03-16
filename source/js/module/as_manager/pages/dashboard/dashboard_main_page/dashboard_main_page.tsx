import * as React from 'react'
import * as Morearty from 'morearty'
import * as Immutable from 'immutable'

import {DashboardCard} from "module/ui/dashboard_components/main_components/dashboard_card/dashboard_card";
import {DashboardSchoolProfileWidget} from "module/ui/dashboard_components/dashboard_school_profile_widget/dashboard_school_profile_widget";

import 'styles/ui/dashboard/dashboard_main_page.scss'
import {DashboardDataWidget} from "module/ui/dashboard_components/dashboard_data_widget/dashboard_data_widget";
import {DashboardCalendarWidget} from "module/as_manager/pages/dashboard/dashboard_main_page/components/dashboard_calendar_widget/dashboard_calendar_widget";
import {SchoolDataWidgetActions} from "module/as_manager/pages/dashboard/dashboard_main_page/actions/school_data_widget_actions";

export const DashboardMainPage = (React as any).createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: (React as any).PropTypes.string.isRequired
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			schoolDataWidget: {
				data: {
					dataItems:[
						{name: 'Students', value: '0'},
						{name: 'Forms', value: '0'},
						{name: 'Houses', value: '0'},
						{name: 'Teams', value: '0'}
					]
				}
			}
		});
	},
	componentWillMount() {
		SchoolDataWidgetActions.getDataForSchoolDataWidget(this.props.activeSchoolId).then(data => {
			this.getDefaultBinding().set('schoolDataWidget.data', Immutable.fromJS(data));
		});
	},
	getSchoolDataData() {
		return this.getDefaultBinding().toJS('schoolDataWidget.data');
	},
	getSchoolUsersData() {
		return {
			dataItems:[
				{name: 'School Admin staff', value: '5'},
				{name: 'School PE staff', value: '12'},
				{name: 'Parents', value: '175'},
				{name: 'Students', value: '145'},
				{name: 'Requests pending', value: '9'}
			]
		};
	},
	getSchoolInvitesData() {
		return {
			dataItems:[
				{name: 'Invites(new)', value: '6'},
				{name: 'Outbox(pending)', value: '19'},
				{name: 'Archive', value: '463'}
			]
		};
	},
	render() {
		return (
			<div className="bDashboardMainPage">
				<div className='eDashboardMainPage_mainContainer'>
					<div className='eDashboardMainPage_row'>
						<DashboardCard
							bootstrapWrapperStyle='col-xs-6 col-sm-4 col-md-3'
							headerText='School Profile'
						>
							<DashboardSchoolProfileWidget school={{name: 'GreatWalsteadSchool'}}/>
						</DashboardCard>
						<DashboardCard
							headerText='School Data'
							bootstrapWrapperStyle='col-xs-6 col-sm-4 col-md-3'
						>
							<DashboardDataWidget
								data={this.getSchoolDataData()}
							/>
						</DashboardCard>
						<DashboardCard
							headerText='School Users'
							bootstrapWrapperStyle='col-xs-6 col-sm-4 col-md-3'
						>
							<DashboardDataWidget
								data={this.getSchoolUsersData()}
							/>
						</DashboardCard>
						<DashboardCard
							headerText='Invites'
							bootstrapWrapperStyle='col-xs-6 col-sm-4 col-md-3'
						>
							<DashboardDataWidget
								data={this.getSchoolInvitesData()}
							/>
						</DashboardCard>
					</div>
					<div className='eDashboardMainPage_row'>
						<DashboardCard
							headerText='Fixtures and results'
							bootstrapWrapperStyle='col-xs-12 col-sm-12 col-md-12'
						>
							<DashboardCalendarWidget binding={this.getDefaultBinding().sub('dashboardCalendarWidget')}/>
						</DashboardCard>
					</div>
				</div>
			</div>
		);
	}
});