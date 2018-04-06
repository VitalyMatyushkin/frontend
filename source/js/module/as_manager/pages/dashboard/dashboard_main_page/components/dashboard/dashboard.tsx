import * as React from 'react'
import * as Loader from 'module/ui/loader';
import ReactResizeDetector from 'react-resize-detector';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import DashboardDropSection from 'module/as_manager/pages/dashboard/dashboard_main_page/components/dashboard/dashboard_drop_section'

import {DashboardSchoolProfileWidget} from "module/ui/dashboard_components/dashboard_school_profile_widget/dashboard_school_profile_widget";
import {DashboardDataWidget} from "module/ui/dashboard_components/dashboard_data_widget/dashboard_data_widget";
import {DashboardWeatherWidget} from "module/ui/dashboard_components/dashboard_weather_widget/dashboard_weather_widget";
import {DashboardCalendarWidget} from "module/as_manager/pages/dashboard/dashboard_main_page/components/dashboard_calendar_widget/dashboard_calendar_widget";
import {DashboardCardCol} from "module/ui/dashboard_components/main_components/dashboard_card_col/dashboard_card_col";
import {MoveResult} from "module/ui/dashboard_components/main_components/dashboard_card/dashboard_card_header";

import 'styles/ui/dashboard/dasbboard.scss'

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
	isPin: boolean
	isMinimize: boolean
	delta: number
	isSync: boolean
}

export interface DashboardProps {
	widgetArray: Widget[],
	// TODO need type
	handleDroppedWidget: (moveResult: MoveResult) => void,
	handlePinWidget: (type: WIDGET_TYPE) => void
	handleMinimizeWidget: (type: WIDGET_TYPE) => void
	handleResize: (type: WIDGET_TYPE, delta: number) => void
	calendarWidgetBinding: any
}

const DEFAULT_WIDTH = 1200;

class Dashboard extends React.Component<DashboardProps, {width: number}> {
	dashboard = undefined;
	componentWillMount() {
		this.setState({width: DEFAULT_WIDTH})
	}
	componentDidMount() {
		this.setState({width: this.dashboard.clientWidth})
	}
	getColWidth() {
		return this.state.width/12;
	}
	renderDashboardSchoolProfileWidget(widgetData: Widget, index: number) {
		let widget = null;

		if(widgetData.isSync) {
			widget = <DashboardSchoolProfileWidget school={widgetData.data}/>;
		} else {
			widget = <Loader condition={true}/>;
		}

		return (
			<DashboardCardCol
				isPin={widgetData.isPin}
				isMinimize={widgetData.isMinimize}
				handlePinWidget={() => this.props.handlePinWidget(WIDGET_TYPE.SchoolProfileWidget)}
				handleMinimizeWidget={() => this.props.handleMinimizeWidget(WIDGET_TYPE.SchoolProfileWidget)}
				headerText='School Profile'
				handleDroppedWidget={this.props.handleDroppedWidget}
				index={index}
				colWidth={this.getColWidth()}
				mdWidth={3}
				smWidth={4}
				xsWidth={6}
				widget={widget}
				handleResize={(delta) => this.props.handleResize(WIDGET_TYPE.SchoolProfileWidget, delta)}
				delta={widgetData.delta}
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
				isPin={widgetData.isPin}
				isMinimize={widgetData.isMinimize}
				handlePinWidget={() => this.props.handlePinWidget(WIDGET_TYPE.SchoolDataWidgetData)}
				handleMinimizeWidget={() => this.props.handleMinimizeWidget(WIDGET_TYPE.SchoolDataWidgetData)}
				headerText='School Data'
				handleDroppedWidget={this.props.handleDroppedWidget}
				index={index}
				colWidth={this.getColWidth()}
				mdWidth={3}
				smWidth={4}
				xsWidth={6}
				widget={widget}
				handleResize={(delta) => this.props.handleResize(WIDGET_TYPE.SchoolDataWidgetData, delta)}
				delta={widgetData.delta}
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
				isPin={widgetData.isPin}
				isMinimize={widgetData.isMinimize}
				handlePinWidget={() => this.props.handlePinWidget(WIDGET_TYPE.SchoolUsersWidgetData)}
				handleMinimizeWidget={() => this.props.handleMinimizeWidget(WIDGET_TYPE.SchoolUsersWidgetData)}
				headerText='School Users'
				handleDroppedWidget={this.props.handleDroppedWidget}
				index={index}
				colWidth={this.getColWidth()}
				mdWidth={3}
				smWidth={4}
				xsWidth={6}
				widget={widget}
				handleResize={(delta) => this.props.handleResize(WIDGET_TYPE.SchoolUsersWidgetData, delta)}
				delta={widgetData.delta}
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
				isPin={widgetData.isPin}
				isMinimize={widgetData.isMinimize}
				handlePinWidget={() => this.props.handlePinWidget(WIDGET_TYPE.SchoolInvitesWidgetData)}
				handleMinimizeWidget={() => this.props.handleMinimizeWidget(WIDGET_TYPE.SchoolInvitesWidgetData)}
				headerText='Invites'
				handleDroppedWidget={this.props.handleDroppedWidget}
				index={index}
				colWidth={this.getColWidth()}
				mdWidth={3}
				smWidth={4}
				xsWidth={6}
				widget={widget}
				handleResize={(delta) => this.props.handleResize(WIDGET_TYPE.SchoolInvitesWidgetData, delta)}
				delta={widgetData.delta}
			/>
		);
	}
	renderWeatherWidget(widgetData: Widget, index: number) {
		let widget = null;

		if(widgetData.isSync) {
			widget = <DashboardWeatherWidget weatherWidgetList={widgetData.data}/>;
		} else {
			widget = <Loader condition={true}/>;
		}

		return (
			<DashboardCardCol
				isPin={widgetData.isPin}
				isMinimize={widgetData.isMinimize}
				handlePinWidget={() => this.props.handlePinWidget(WIDGET_TYPE.WeatherWidgetData)}
				handleMinimizeWidget={() => this.props.handleMinimizeWidget(WIDGET_TYPE.WeatherWidgetData)}
				headerText='Weather'
				handleDroppedWidget={this.props.handleDroppedWidget}
				index={index}
				colWidth={this.getColWidth()}
				mdWidth={12}
				smWidth={12}
				xsWidth={12}
				widget={widget}
				handleResize={(delta) => this.props.handleResize(WIDGET_TYPE.WeatherWidgetData, delta)}
				delta={widgetData.delta}
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
				isPin={widgetData.isPin}
				isMinimize={widgetData.isMinimize}
				handlePinWidget={() => this.props.handlePinWidget(WIDGET_TYPE.CalendarWidgetData)}
				handleMinimizeWidget={() => this.props.handleMinimizeWidget(WIDGET_TYPE.CalendarWidgetData)}
				headerText='Fixtures and results'
				handleDroppedWidget={this.props.handleDroppedWidget}
				index={index}
				colWidth={this.getColWidth()}
				mdWidth={12}
				smWidth={12}
				xsWidth={12}
				widget={widget}
				// It's good size for cute widget fit
				minSizeConstraints={[500, 250]}
				handleResize={(delta) => this.props.handleResize(WIDGET_TYPE.CalendarWidgetData, delta)}
				delta={widgetData.delta}
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
							canDrop={!widget.isPin}
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
							canDrop={!widget.isPin}
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
							canDrop={!widget.isPin}
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
							canDrop={!widget.isPin}
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
							canDrop={!widget.isPin}
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
							canDrop={!widget.isPin}
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
	handleResizeDashboard(width) {
		this.setState({width: width});
	}
	render() {
		return (
			<div
				className='bDashboard'
				ref={(dashboard) => { this.dashboard = dashboard; }}
			>
				<div className='eDashboard_body'>
					{this.renderWidgets()}
				</div>
				<ReactResizeDetector handleWidth handleHeight onResize={(width) => this.handleResizeDashboard(width)} />
			</div>
		);
	}
}

export default DragDropContext(HTML5Backend)(Dashboard);