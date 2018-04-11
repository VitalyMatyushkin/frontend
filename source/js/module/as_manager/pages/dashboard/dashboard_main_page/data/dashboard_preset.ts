import {DASHBOARD_VIEW_MODE} from "module/as_manager/pages/dashboard/dashboard_main_page/components/dashboard/components/dashboard_view_mode_dropdown";
import {WIDGET_TYPE} from "module/as_manager/pages/dashboard/dashboard_main_page/components/dashboard/dashboard";

export interface DashboardPresetInterface {
	type: DASHBOARD_VIEW_MODE,
	widgetTypes: WIDGET_TYPE[]
}

export const DashboardPresetArray: DashboardPresetInterface[] = [
	{
		type: DASHBOARD_VIEW_MODE.GET_STARTED,
		widgetTypes: [
			WIDGET_TYPE.SchoolProfileWidget,
			WIDGET_TYPE.SchoolUsersWidgetData,
			WIDGET_TYPE.WeatherWidgetData
		]
	},
	{
		type: DASHBOARD_VIEW_MODE.MANAGER,
		widgetTypes: [
			WIDGET_TYPE.SchoolProfileWidget,
			WIDGET_TYPE.SchoolDataWidgetData,
			WIDGET_TYPE.SchoolUsersWidgetData,
			WIDGET_TYPE.SchoolMessagesWidgetData,
			WIDGET_TYPE.SchoolInvitesWidgetData,
			WIDGET_TYPE.WeatherWidgetData,
			WIDGET_TYPE.CalendarWidgetData
		]
	},
	{
		type: DASHBOARD_VIEW_MODE.PE_TEACHER,
		widgetTypes: [
			WIDGET_TYPE.SchoolProfileWidget,
			WIDGET_TYPE.SchoolUsersWidgetData,
			WIDGET_TYPE.WeatherWidgetData,
			WIDGET_TYPE.CalendarWidgetData
		]
	}
];