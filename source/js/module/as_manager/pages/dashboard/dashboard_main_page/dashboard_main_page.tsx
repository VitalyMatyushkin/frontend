import * as React from 'react'
import * as Morearty from 'morearty'
import * as Immutable from 'immutable'
import * as propz from 'propz';

import * as Loader from 'module/ui/loader';

import {DashboardCard} from "module/ui/dashboard_components/main_components/dashboard_card/dashboard_card";
import {DashboardSchoolProfileWidget} from "module/ui/dashboard_components/dashboard_school_profile_widget/dashboard_school_profile_widget";

import 'styles/ui/dashboard/dashboard_main_page.scss'
import {DashboardDataWidget} from "module/ui/dashboard_components/dashboard_data_widget/dashboard_data_widget";
import {DashboardCalendarWidget} from "module/as_manager/pages/dashboard/dashboard_main_page/components/dashboard_calendar_widget/dashboard_calendar_widget";
import {SchoolDataWidgetActions} from "module/as_manager/pages/dashboard/dashboard_main_page/actions/school_data_widget_actions";
import {SchoolInvitesWidgetActions} from "module/as_manager/pages/dashboard/dashboard_main_page/actions/school_invites_widget_actions";
import {SchoolUsersWidgetActions} from "module/as_manager/pages/dashboard/dashboard_main_page/actions/school_users_widget_actions";
import {SchoolProfileWidgetActions} from "module/as_manager/pages/dashboard/dashboard_main_page/actions/school_profile_widget_actions";
import {DashboardWeatherWidget} from "module/ui/dashboard_components/dashboard_weather_widget/dashboard_weather_widget";
import {WeatherWidgetActions} from "module/as_manager/pages/dashboard/dashboard_main_page/actions/weather_widget_actions";

export const DashboardMainPage = (React as any).createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: (React as any).PropTypes.string.isRequired
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			schoolProfileWidgetData: {
				isSync: false,
				school: undefined
			},
			schoolDataWidgetData: {
				isSync: false,
				data: undefined
			},
			schoolUsersWidgetData: {
				isSync: false,
				data: undefined
			},
			schoolInvitesWidgetData: {
				isSync: false,
				data: undefined
			},
			weatherWidgetData: {
				isSync: false,
				data: undefined
			}
		});
	},
	componentWillMount() {
		SchoolProfileWidgetActions.getSchoolData(this.props.activeSchoolId)
			.then(school => {
				this.getDefaultBinding().set('schoolProfileWidgetData.isSync', true);
				this.getDefaultBinding().set('schoolProfileWidgetData.school', Immutable.fromJS(school))

				const coordinates = this.getSchoolCoordinatesBySchool(school);
				return WeatherWidgetActions.getWeatherWidgetData(coordinates.lng, coordinates.lat);
			})
			.then(weatherWidgetData => {
				this.getDefaultBinding().set('weatherWidgetData.isSync', true);
				this.getDefaultBinding().set('weatherWidgetData.data', Immutable.fromJS(weatherWidgetData))
			});

		SchoolDataWidgetActions.getDataForSchoolDataWidget(this.props.activeSchoolId)
			.then(data => {
				this.getDefaultBinding().set('schoolDataWidgetData.isSync', true);
				this.getDefaultBinding().set('schoolDataWidgetData.data', Immutable.fromJS(data));
			});

		SchoolUsersWidgetActions.getDataForSchoolUsersWidget(this.props.activeSchoolId)
			.then(data => {
				this.getDefaultBinding().set('schoolUsersWidgetData.isSync', true);
				this.getDefaultBinding().set('schoolUsersWidgetData.data', Immutable.fromJS(data));
			});

		SchoolInvitesWidgetActions.getDataForSchoolInvitesWidget(this.props.activeSchoolId)
			.then(data => {
				this.getDefaultBinding().set('schoolInvitesWidgetData.isSync', true);
				this.getDefaultBinding().set('schoolInvitesWidgetData.data', Immutable.fromJS(data));
			});
	},
	componentWillUnmount() {
		this.getDefaultBinding().clear();
	},
	getSchoolForSchoolProfileWidget() {
		return this.getDefaultBinding().toJS('schoolProfileWidgetData.school');
	},
	getSchoolDataData() {
		return this.getDefaultBinding().toJS('schoolDataWidgetData.data');
	},
	getSchoolUsersData() {
		return this.getDefaultBinding().toJS('schoolUsersWidgetData.data');
	},
	getSchoolInvitesData() {
		return this.getDefaultBinding().toJS('schoolInvitesWidgetData.data');
	},
	getSchoolCoordinatesBySchool(school): {lat: number, lng: number} {
		return {
			lng: propz.get(school, ['postcode', 'point', 'lng'], undefined),
			lat: propz.get(school, ['postcode', 'point', 'lat'], undefined)
		};
	},
	renderWeatherWidget() {
		let widget = null;

		if(this.getDefaultBinding().toJS('weatherWidgetData.isSync')) {
			widget = <DashboardWeatherWidget data={this.getDefaultBinding().toJS('weatherWidgetData.data')}/>;
		} else {
			widget = <Loader condition={true}/>;
		}

		return widget;
	},
	renderDashboardSchoolProfileWidget() {
		let widget = null;

		if(this.getDefaultBinding().toJS('schoolProfileWidgetData.isSync')) {
			widget = <DashboardSchoolProfileWidget school={this.getSchoolForSchoolProfileWidget()}/>;
		} else {
			widget = <Loader condition={true}/>;
		}

		return widget;
	},
	renderSchoolDataWidget() {
		let widget = null;

		if(this.getDefaultBinding().toJS('schoolDataWidgetData.isSync')) {
			widget = <DashboardDataWidget data={this.getSchoolDataData()}/>
		} else {
			widget = <Loader condition={true}/>;
		}

		return widget;
	},
	renderSchoolUsersWidget() {
		let widget = null;

		if(this.getDefaultBinding().toJS('schoolUsersWidgetData.isSync')) {
			widget = <DashboardDataWidget data={this.getSchoolUsersData()}/>
		} else {
			widget = <Loader condition={true}/>;
		}

		return widget;
	},
	renderSchoolInvitesWidget() {
		let widget = null;

		if(this.getDefaultBinding().toJS('schoolInvitesWidgetData.isSync')) {
			widget = <DashboardDataWidget data={this.getSchoolInvitesData()}/>;
		} else {
			widget = <Loader condition={true}/>;
		}

		return widget;
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
							{this.renderDashboardSchoolProfileWidget()}
						</DashboardCard>
						<DashboardCard
							headerText='School Data'
							bootstrapWrapperStyle='col-xs-6 col-sm-4 col-md-3'
						>
							{this.renderSchoolDataWidget()}
						</DashboardCard>
						<DashboardCard
							headerText='School Users'
							bootstrapWrapperStyle='col-xs-6 col-sm-4 col-md-3'
						>
							{this.renderSchoolUsersWidget()}
						</DashboardCard>
						<DashboardCard
							headerText='Invites'
							bootstrapWrapperStyle='col-xs-6 col-sm-4 col-md-3'
						>
							{this.renderSchoolInvitesWidget()}
						</DashboardCard>
						<DashboardCard
							headerText='Weather'
							bootstrapWrapperStyle='col-xs-6 col-sm-6 col-md-3'
						>
							{this.renderWeatherWidget()}
						</DashboardCard>
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