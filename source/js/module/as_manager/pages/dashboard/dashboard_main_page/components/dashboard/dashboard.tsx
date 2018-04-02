import * as React from 'react'
import * as Loader from 'module/ui/loader';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import DashboardDropSection from 'module/as_manager/pages/dashboard/dashboard_main_page/components/dashboard/dashboard_drop_section'

import {DashboardSchoolProfileWidget} from "module/ui/dashboard_components/dashboard_school_profile_widget/dashboard_school_profile_widget";
import {DashboardDataWidget} from "module/ui/dashboard_components/dashboard_data_widget/dashboard_data_widget";
import {DashboardWeatherWidget} from "module/ui/dashboard_components/dashboard_weather_widget/dashboard_weather_widget";

import 'styles/ui/dashboard/dasbboard.scss'
import {DashboardCalendarWidget} from "module/as_manager/pages/dashboard/dashboard_main_page/components/dashboard_calendar_widget/dashboard_calendar_widget";
import {DashboardCardCol} from "module/ui/dashboard_components/main_components/dashboard_card_col/dashboard_card_col";
import {MoveResult} from "module/ui/dashboard_components/main_components/dashboard_card/dashboard_card_header";

export enum WIDGET_TYPE {
	SchoolProfileWidget = 'SCHOOL_PROFILE_WIDGET',
	SchoolDataWidgetData = 'SCHOOL_DATA_WIDGET_DATA',
	SchoolUsersWidgetData = 'SCHOOL_USERS_WIDGET_DATA',
	SchoolInvitesWidgetData = 'SCHOOL_INVITES_WIDGET_DATA',
	WeatherWidgetData = 'WEATHER_WIDGET_DATA',
	CalendarWidgetData = 'CALENDAR_WIDGET_DATA'
}

export interface Widget {
	type: string,
	data: any,
	isSync: boolean
}

export interface DashboardProps {
	widgetArray: Widget[],
	// TODO need type
	handleDroppedWidget: (moveResult: MoveResult) => void,
	calendarWidgetBinding: any
}

class Dashboard extends React.Component<DashboardProps, {}> {
	renderDashboardSchoolProfileWidget(widgetData: Widget, index: number) {
		let widget = null;

		if(widgetData.isSync) {
			widget = <DashboardSchoolProfileWidget school={widgetData.data}/>;
		} else {
			widget = <Loader condition={true}/>;
		}

		return (
			<DashboardCardCol
				headerText='School Profile'
				handleDroppedWidget={this.props.handleDroppedWidget}
				index={index}
				mdWidth={3}
				smWidth={4}
				xsWidth={6}
				widget={widget}
			/>

		);
	}
	renderSchoolDataWidget(widgetData: Widget, index: number) {
		let widget = null;

		if(widgetData.isSync) {
			widget = <DashboardDataWidget data={widgetData.data}/>
		} else {
			widget = <Loader condition={true}/>;
		}

		return (
			<DashboardCardCol
				headerText='School Data'
				handleDroppedWidget={this.props.handleDroppedWidget}
				index={index}
				mdWidth={3}
				smWidth={4}
				xsWidth={6}
				widget={widget}
			/>
		);
	}
	renderSchoolUsersWidget(widgetData: Widget, index: number) {
		let widget = null;

		if(widgetData.isSync) {
			widget = <DashboardDataWidget data={widgetData.data}/>
		} else {
			widget = <Loader condition={true}/>;
		}

		return (
			<DashboardCardCol
				headerText='School Users'
				handleDroppedWidget={this.props.handleDroppedWidget}
				index={index}
				mdWidth={3}
				smWidth={4}
				xsWidth={6}
				widget={widget}
			/>
		);
	}
	renderSchoolInvitesWidget(widgetData: Widget, index: number) {
		let widget = null;

		if(widgetData.isSync) {
			widget = <DashboardDataWidget data={widgetData.data}/>;
		} else {
			widget = <Loader condition={true}/>;
		}

		return (
			<DashboardCardCol
				headerText='Invites'
				handleDroppedWidget={this.props.handleDroppedWidget}
				index={index}
				mdWidth={3}
				smWidth={4}
				xsWidth={6}
				widget={widget}
			/>
		);
	}
	renderWeatherWidget(widgetData: Widget, index: number) {
		let widget = null;

		if(widgetData.isSync) {
			widget = <DashboardWeatherWidget data={widgetData.data}/>;
		} else {
			widget = <Loader condition={true}/>;
		}

		return (
			<DashboardCardCol
				headerText='Weather'
				handleDroppedWidget={this.props.handleDroppedWidget}
				index={index}
				mdWidth={3}
				smWidth={4}
				xsWidth={6}
				widget={widget}
			/>
		);
	}
	renderCalendarWidget(widgetData: Widget, index: number) {
		let widget = null;

		if(widgetData.isSync) {
			widget = <DashboardCalendarWidget binding={this.props.calendarWidgetBinding}/>;
		} else {
			widget = <Loader condition={true}/>;
		}

		return (
			<DashboardCardCol
				headerText='Fixtures and results'
				handleDroppedWidget={this.props.handleDroppedWidget}
				index={index}
				mdWidth={12}
				smWidth={12}
				xsWidth={12}
				widget={widget}
			/>
		);
	}
	renderWidgets() {
		return this.props.widgetArray.map((widget, index) => {
			switch (widget.type) {
				case WIDGET_TYPE.SchoolProfileWidget: {
					return (
						<DashboardDropSection
							key={`${index}_${widget.type}`}
							index={index}
						>
							{this.renderDashboardSchoolProfileWidget(widget, index)}
						</DashboardDropSection>
					);
				}
				case WIDGET_TYPE.SchoolUsersWidgetData: {
					return (
						<DashboardDropSection
							key={`${index}_${widget.type}`}
							index={index}
						>
							{this.renderSchoolUsersWidget(widget, index)}
						</DashboardDropSection>
					);
				}
				case WIDGET_TYPE.SchoolDataWidgetData: {
					return (
						<DashboardDropSection
							key={`${index}_${widget.type}`}
							index={index}
						>
							{this.renderSchoolDataWidget(widget, index)}
						</DashboardDropSection>
					);
				}
				case WIDGET_TYPE.SchoolInvitesWidgetData: {
					return (
						<DashboardDropSection
							key={`${index}_${widget.type}`}
							index={index}
						>
							{this.renderSchoolInvitesWidget(widget, index)}
						</DashboardDropSection>
					);
				}
				case WIDGET_TYPE.WeatherWidgetData: {
					return (
						<DashboardDropSection
							key={`${index}_${widget.type}`}
							index={index}
						>
							{this.renderWeatherWidget(widget, index)}
						</DashboardDropSection>
					);
				}
				case WIDGET_TYPE.CalendarWidgetData: {
					return (
						<DashboardDropSection
							key={`${index}_${widget.type}`}
							index={index}
						>
							{this.renderCalendarWidget(widget, index)}
						</DashboardDropSection>
					);
				}
				default: {
					return null;
				}
			}
		});
	}
	render() {
		return (
			<div className='bDashboard'>
				<div className='eDashboard_body'>
					{this.renderWidgets()}
				</div>
			</div>
		);
	}
}

export default DragDropContext(HTML5Backend)(Dashboard);