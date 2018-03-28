import * as React from 'react'
import * as Loader from 'module/ui/loader';

import DashboardDropSection from 'module/as_manager/pages/dashboard/dashboard_main_page/components/dashboard/dashboard_drop_section'

import {DashboardSchoolProfileWidget} from "module/ui/dashboard_components/dashboard_school_profile_widget/dashboard_school_profile_widget";
import {DashboardDataWidget} from "module/ui/dashboard_components/dashboard_data_widget/dashboard_data_widget";

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import 'styles/ui/dashboard/dashboard_main_page.scss'
import {DashboardWeatherWidget} from "module/ui/dashboard_components/dashboard_weather_widget/dashboard_weather_widget";

export enum WIDGET_TYPE {
	SchoolProfileWidget = 'SCHOOL_PROFILE_WIDGET',
	SchoolDataWidgetData = 'SCHOOL_DATA_WIDGET_DATA',
	SchoolUsersWidgetData = 'SCHOOL_USERS_WIDGET_DATA',
	SchoolInvitesWidgetData = 'SCHOOL_INVITES_WIDGET_DATA',
	WeatherWidgetData = 'WEATHER_WIDGET_DATA'
}

export interface Widget {
	type: string,
	data: any,
	isSync: boolean
}

export interface DashboardProps {
	widgetArray: Widget[]
}

class Dashboard extends React.Component<DashboardProps, {}> {
	renderDashboardSchoolProfileWidget(widgetData) {
		let widget = null;

		if(widgetData.isSync) {
			widget = <DashboardSchoolProfileWidget school={widgetData.school}/>;
		} else {
			widget = <Loader condition={true}/>;
		}

		return widget;
	}
	renderSchoolDataWidget(widgetData) {
		let widget = null;

		if(widgetData.isSync) {
			widget = <DashboardDataWidget data={widgetData.data}/>
		} else {
			widget = <Loader condition={true}/>;
		}

		return widget;
	}
	renderSchoolUsersWidget(widgetData) {
		let widget = null;

		if(widgetData.isSync) {
			widget = <DashboardDataWidget data={widgetData.data}/>
		} else {
			widget = <Loader condition={true}/>;
		}

		return widget;
	}
	renderSchoolInvitesWidget(widgetData) {
		let widget = null;

		if(widgetData.isSync) {
			widget = <DashboardDataWidget data={widgetData.data}/>;
		} else {
			widget = <Loader condition={true}/>;
		}

		return widget;
	}
	renderWeatherWidget(widgetData) {
		let widget = null;

		if(widgetData.isSync) {
			widget = <DashboardWeatherWidget data={widgetData.data}/>;
		} else {
			widget = <Loader condition={true}/>;
		}

		return widget;
	}
	renderWidgets() {
		return this.props.widgetArray.map(widget => {
			switch (widget.type) {
				case WIDGET_TYPE.SchoolProfileWidget: {
					return this.renderDashboardSchoolProfileWidget(widget);
				}
				case WIDGET_TYPE.SchoolUsersWidgetData: {
					return this.renderSchoolUsersWidget(widget);
				}
				case WIDGET_TYPE.SchoolDataWidgetData: {
					return this.renderSchoolDataWidget(widget);
				}
				case WIDGET_TYPE.SchoolInvitesWidgetData: {
					return this.renderSchoolInvitesWidget(widget);
				}
				case WIDGET_TYPE.WeatherWidgetData: {
					return this.renderWeatherWidget(widget);
				}
				default: {
					return null;
				}
			}
		});
	}
	render() {
		return (
			<div className='eDashboardMainPage_mainContainer'>
				<DashboardDropSection>
					{this.renderWidgets()}
				</DashboardDropSection>
			</div>
		);
	}
}

export default DragDropContext(HTML5Backend)(Dashboard);