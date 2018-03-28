import * as React from 'react'
import * as Morearty from 'morearty'
import * as Immutable from 'immutable'
import * as propz from 'propz';

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
					isSync: false
				},
				{
					type: WIDGET_TYPE.SchoolDataWidgetData,
					data: undefined,
					isSync: false
				},
				{
					type: WIDGET_TYPE.SchoolUsersWidgetData,
					data: undefined,
					isSync: false
				},
				{
					type: WIDGET_TYPE.SchoolInvitesWidgetData,
					data: undefined,
					isSync: false
				},
				{
					type: WIDGET_TYPE.WeatherWidgetData,
					data: undefined,
					isSync: false
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
	componentWillUnmount() {
		this.getDefaultBinding().clear();
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
	render() {
		return (
			<div className="bDashboardMainPage">
				<Dashboard widgetArray={this.getWidgetArray()}/>
			</div>
		);
	}
});