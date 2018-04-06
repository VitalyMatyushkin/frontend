import * as React from 'react'
import * as Morearty from 'morearty'
import * as Immutable from 'immutable'
import * as propz from 'propz';

import {MoveResult} from "module/ui/dashboard_components/main_components/dashboard_card/dashboard_card_header";

import {SchoolDataWidgetActions} from "module/as_manager/pages/dashboard/dashboard_main_page/actions/school_data_widget_actions";
import {SchoolInvitesWidgetActions} from "module/as_manager/pages/dashboard/dashboard_main_page/actions/school_invites_widget_actions";
import {SchoolUsersWidgetActions} from "module/as_manager/pages/dashboard/dashboard_main_page/actions/school_users_widget_actions";
import {SchoolProfileWidgetActions} from "module/as_manager/pages/dashboard/dashboard_main_page/actions/school_profile_widget_actions";
import {WeatherWidgetActions} from "module/as_manager/pages/dashboard/dashboard_main_page/actions/weather_widget_actions";
import Dashboard, {
	Widget,
	WIDGET_TYPE
} from "module/as_manager/pages/dashboard/dashboard_main_page/components/dashboard/dashboard";

import 'styles/ui/dashboard/dashboard_main_page.scss'

export const DashboardMainPage = (React as any).createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: (React as any).PropTypes.string.isRequired
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			widgetArray: [
				{
					type: WIDGET_TYPE.SchoolProfileWidget,
					data: undefined,
					isPin: false,
					isMinimize: false,
					delta: 0,
					isSync: false
				},
				{
					type: WIDGET_TYPE.SchoolDataWidgetData,
					data: undefined,
					isPin: false,
					isMinimize: false,
					delta: 0,
					isSync: false
				},
				{
					type: WIDGET_TYPE.SchoolUsersWidgetData,
					data: undefined,
					isPin: false,
					isMinimize: false,
					delta: 0,
					isSync: false
				},
				{
					type: WIDGET_TYPE.SchoolInvitesWidgetData,
					data: undefined,
					isPin: false,
					isMinimize: false,
					delta: 0,
					isSync: false
				},
				{
					type: WIDGET_TYPE.WeatherWidgetData,
					data: undefined,
					isPin: false,
					isMinimize: false,
					delta: 0,
					isSync: false
				},
				{
					type: WIDGET_TYPE.CalendarWidgetData,
					isPin: false,
					isMinimize: false,
					delta: 0,
					isSync: true
				}
			]
		});
	},
	componentWillMount() {
		SchoolProfileWidgetActions.getSchoolData(this.props.activeSchoolId)
			.then(school => {
				this.initWidgetByType(school, WIDGET_TYPE.SchoolProfileWidget);

				const coordinates = this.getSchoolCoordinatesBySchool(school);
				return WeatherWidgetActions.getWeatherWidgetData(coordinates.lng, coordinates.lat);
			})
			.then(weatherWidgetData => this.initWidgetByType(weatherWidgetData, WIDGET_TYPE.WeatherWidgetData));

		SchoolDataWidgetActions.getDataForSchoolDataWidget(this.props.activeSchoolId)
			.then(data => this.initWidgetByType(data, WIDGET_TYPE.SchoolDataWidgetData));

		SchoolUsersWidgetActions.getDataForSchoolUsersWidget(this.props.activeSchoolId)
			.then(data => this.initWidgetByType(data, WIDGET_TYPE.SchoolUsersWidgetData));

		SchoolInvitesWidgetActions.getDataForSchoolInvitesWidget(this.props.activeSchoolId)
			.then(data => this.initWidgetByType(data, WIDGET_TYPE.SchoolInvitesWidgetData));
	},
	componentWillUnmount() {
		this.getDefaultBinding().clear();
	},
	handlePinWidget(type: WIDGET_TYPE) {
		const binding = this.getDefaultBinding();
		const widgetArray: Widget[] = binding.toJS('widgetArray');

		const widgetIndex = widgetArray.findIndex(widget => widget.type === type);
		if(widgetIndex !== -1) {
			widgetArray[widgetIndex].isPin = !widgetArray[widgetIndex].isPin;
			binding.set('widgetArray', Immutable.fromJS(widgetArray));
		}
	},
	handleMinimizeWidget(type: WIDGET_TYPE) {
		const binding = this.getDefaultBinding();
		const widgetArray: Widget[] = binding.toJS('widgetArray');

		const widgetIndex = widgetArray.findIndex(widget => widget.type === type);
		if(widgetIndex !== -1) {
			widgetArray[widgetIndex].isMinimize = !widgetArray[widgetIndex].isMinimize;
			binding.set('widgetArray', Immutable.fromJS(widgetArray));
		}
	},
	handleResize(type: WIDGET_TYPE, delta: number) {
		const binding = this.getDefaultBinding();
		const widgetArray: Widget[] = binding.toJS('widgetArray');

		const widgetIndex = widgetArray.findIndex(widget => widget.type === type);
		if(widgetIndex !== -1) {
			widgetArray[widgetIndex].delta = delta;
			binding.set('widgetArray', Immutable.fromJS(widgetArray));
		}
	},
	/**
	 * Sets data and flag isSync to true by widgetType
	 * Use for init state of widget in componentWillMount
	 * @param data
	 * @param {WIDGET_TYPE} widgetType
	 */
	initWidgetByType(data: any, widgetType: WIDGET_TYPE) {
		const binding = this.getDefaultBinding();
		const widgetArray: Widget[] = binding.toJS('widgetArray');

		const schoolProfileWidgetIndex = widgetArray.findIndex(widget => widget.type === widgetType);
		widgetArray[schoolProfileWidgetIndex].isSync = true;
		widgetArray[schoolProfileWidgetIndex].data = data;

		binding.set('widgetArray', Immutable.fromJS(widgetArray));
	},
	getSchoolCoordinatesBySchool(school): {lat: number, lng: number} {
		return {
			lng: propz.get(school, ['postcode', 'point', 'lng'], undefined),
			lat: propz.get(school, ['postcode', 'point', 'lat'], undefined)
		};
	},
	getWidgetArray(): Widget[] {
		return this.getDefaultBinding().toJS('widgetArray');
	},
	handleDroppedWidget(moveResult: MoveResult) {
		const binding = this.getDefaultBinding();
		const widgetArray: Widget[] = binding.toJS('widgetArray');

		// copy
		const droppedWidget = Object.assign({}, widgetArray[moveResult.whoDroppedIndex]);
		// insert
		widgetArray.splice(moveResult.whereDroppedIndex, 0, droppedWidget);
		// remove widget at old position
		widgetArray.splice(
			// shift up by one point old position if new position less then old position
			moveResult.whereDroppedIndex < moveResult.whoDroppedIndex ?
				moveResult.whoDroppedIndex + 1 : moveResult.whoDroppedIndex,
			1);

		binding.set('widgetArray', Immutable.fromJS(widgetArray));
	},
	render() {
		return (
			<div className="bDashboardMainPage">
				<Dashboard
					widgetArray={this.getWidgetArray()}
					handleDroppedWidget={(moveResult) => this.handleDroppedWidget(moveResult)}
					calendarWidgetBinding={this.getDefaultBinding().sub('dashboardCalendarWidget')}
					handlePinWidget={(type) => this.handlePinWidget(type)}
					handleMinimizeWidget={(type) => this.handleMinimizeWidget(type)}
					handleResize={(type, delta) => this.handleResize(type, delta)}
				/>
			</div>
		);
	}
});