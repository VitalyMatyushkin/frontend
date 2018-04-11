import * as React from 'react'
import * as Morearty from 'morearty'
import * as Immutable from 'immutable'
import * as propz from 'propz';
import * as BPromise from 'bluebird';
import * as StorageHelpers from 'module/helpers/storage';

import {MoveResult} from "module/ui/dashboard_components/main_components/dashboard_card/dashboard_card_header";

import {SchoolDataWidgetActions} from "module/as_manager/pages/dashboard/dashboard_main_page/actions/school_data_widget_actions";
import {SchoolInvitesWidgetActions} from "module/as_manager/pages/dashboard/dashboard_main_page/actions/school_invites_widget_actions";
import {SchoolMessagesWidgetActions} from "module/as_manager/pages/dashboard/dashboard_main_page/actions/school_messages_widget_actions";
import {SchoolUsersWidgetActions} from "module/as_manager/pages/dashboard/dashboard_main_page/actions/school_users_widget_actions";
import {SchoolProfileWidgetActions} from "module/as_manager/pages/dashboard/dashboard_main_page/actions/school_profile_widget_actions";
import {WeatherWidgetActions} from "module/as_manager/pages/dashboard/dashboard_main_page/actions/weather_widget_actions";
import Dashboard, {
	Widget,
	WIDGET_TYPE
} from "module/as_manager/pages/dashboard/dashboard_main_page/components/dashboard/dashboard";

import * as RoleHelper from 'module/helpers/role_helper'

import 'styles/ui/dashboard/dashboard_main_page.scss'
import {DASHBOARD_VIEW_MODE} from "module/as_manager/pages/dashboard/dashboard_main_page/components/dashboard/components/dashboard_view_mode_dropdown";
import {DashboardPresetArray} from "module/as_manager/pages/dashboard/dashboard_main_page/data/dashboard_preset";

export const DashboardMainPage = (React as any).createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: (React as any).PropTypes.string.isRequired
	},
	getDefaultState: function () {
		const dashboard = this.getDashboardStateFromLocalStorage();

		if(typeof dashboard !== 'undefined') {
			 return Immutable.fromJS(dashboard);
		} else {
			const dashboardModeView = this.getDefaultDashboardViewMode();
			return Immutable.fromJS({
				dashboardModeView: dashboardModeView,
				widgetArray: this.getDefaultWidgetsStateByDashboardViewMode(dashboardModeView)
			});
		}
	},
	componentWillMount() {
		this.updateWidgetArrayData().then(() => this.saveDashboardStateToLocalStorage());
	},
	getDefaultDashboardViewMode() {
		const permission = this.getMoreartyContext().getBinding().toJS('userData.roleList.activePermission');

		let dashboardViewMode;
		switch (permission.role) {
			case RoleHelper.USER_ROLES.TEACHER: {
				dashboardViewMode = DASHBOARD_VIEW_MODE.PE_TEACHER;
				break;
			}
			default: {
				dashboardViewMode = DASHBOARD_VIEW_MODE.GET_STARTED;
			}
		}

		return dashboardViewMode;
	},
	getDefaultWidgetsStateByDashboardViewMode(dashboardViewMode: DASHBOARD_VIEW_MODE) {
		const currentPreset = DashboardPresetArray.find(preset => preset.type === dashboardViewMode);

		return currentPreset.widgetTypes.map(widgetType => {
			return {
				type: widgetType,
				data: undefined,
				isPin: false,
				isMinimize: false,
				delta: 0,
				// Calendar always sync
				isSync: widgetType === WIDGET_TYPE.CalendarWidgetData
			}
		});
	},
	updateWidgetArrayData() {
		const promises = [];

		const widgetArray = this.getDefaultBinding().toJS('widgetArray');

		widgetArray.forEach(widget => {
			switch (widget.type) {
				case WIDGET_TYPE.SchoolProfileWidget: {
					promises.push(
						SchoolProfileWidgetActions.getSchoolData(this.props.activeSchoolId)
							.then(school => {
								this.initWidgetByType(school, WIDGET_TYPE.SchoolProfileWidget);

								const coordinates = this.getSchoolCoordinatesBySchool(school);
								return WeatherWidgetActions.getWeatherWidgetData(coordinates.lng, coordinates.lat);
							})
							.then(weatherWidgetData => {
								this.initWidgetByType(weatherWidgetData, WIDGET_TYPE.WeatherWidgetData);

								return true;
							})
					);
					break;
				}
				case WIDGET_TYPE.SchoolDataWidgetData: {
					promises.push(
						SchoolDataWidgetActions.getDataForSchoolDataWidget(this.props.activeSchoolId)
							.then(data => this.initWidgetByType(data, WIDGET_TYPE.SchoolDataWidgetData))
					);
					break;
				}
				case WIDGET_TYPE.SchoolUsersWidgetData: {
					promises.push(
						SchoolUsersWidgetActions.getDataForSchoolUsersWidget(this.props.activeSchoolId)
							.then(data => this.initWidgetByType(data, WIDGET_TYPE.SchoolUsersWidgetData))
					);
					break;
				}
				case WIDGET_TYPE.SchoolInvitesWidgetData: {
					promises.push(
						SchoolInvitesWidgetActions.getDataForSchoolInvitesWidget(this.props.activeSchoolId)
							.then(data => this.initWidgetByType(data, WIDGET_TYPE.SchoolInvitesWidgetData))
					);
					break;
				}
				case WIDGET_TYPE.SchoolMessagesWidgetData: {
					promises.push(
						SchoolMessagesWidgetActions.getDataForSchoolMessagesWidget(this.props.activeSchoolId)
							.then(data => this.initWidgetByType(data, WIDGET_TYPE.SchoolMessagesWidgetData))
					);
					break;
				}
			}
		});

		return BPromise.all(promises);
	},
	getDashboardStateFromLocalStorage() {
		let dashboard;

		const permissionId = this.getMoreartyContext().getBinding().get('userData.roleList.activePermission.id');

		const dashboardState = StorageHelpers.LocalStorage.get('dashboardState');
		if(typeof dashboardState !== 'undefined') {
			dashboard = dashboardState.find(state => state.permissionId === permissionId);
		}

		return {
			widgetArray: dashboard.widgetArray,
			dashboardModeView: dashboard.dashboardModeView
		};
	},
	saveDashboardStateToLocalStorage() {
		const permissionId = this.getMoreartyContext().getBinding().get('userData.roleList.activePermission.id');

		let dashboardState = StorageHelpers.LocalStorage.get('dashboardState');
		if(typeof dashboardState === 'undefined') {
			dashboardState = [];
		}

		const currentDashBoardStateIndex = dashboardState.findIndex(state => state.permissionId === permissionId);
		if(currentDashBoardStateIndex === -1) {
			dashboardState.push({
				permissionId: permissionId,
				dashboardModeView: this.getDefaultBinding().toJS('dashboardModeView'),
				widgetArray: this.getDefaultBinding().toJS('widgetArray')
			});
		} else {
			dashboardState[currentDashBoardStateIndex].widgetArray = this.getDefaultBinding().toJS('widgetArray');
			dashboardState[currentDashBoardStateIndex].dashboardModeView = this.getDefaultBinding().toJS('dashboardModeView');
		}

		StorageHelpers.LocalStorage.set('dashboardState', dashboardState);
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
			this.saveDashboardStateToLocalStorage();
		}
	},
	handleMinimizeWidget(type: WIDGET_TYPE) {
		const binding = this.getDefaultBinding();
		const widgetArray: Widget[] = binding.toJS('widgetArray');

		const widgetIndex = widgetArray.findIndex(widget => widget.type === type);
		if(widgetIndex !== -1) {
			widgetArray[widgetIndex].isMinimize = !widgetArray[widgetIndex].isMinimize;
			binding.set('widgetArray', Immutable.fromJS(widgetArray));
			this.saveDashboardStateToLocalStorage();
		}
	},
	handleResize(type: WIDGET_TYPE, delta: number) {
		const binding = this.getDefaultBinding();
		const widgetArray: Widget[] = binding.toJS('widgetArray');

		const widgetIndex = widgetArray.findIndex(widget => widget.type === type);
		if(widgetIndex !== -1) {
			widgetArray[widgetIndex].delta = delta;
			binding.set('widgetArray', Immutable.fromJS(widgetArray));
			this.saveDashboardStateToLocalStorage();
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
		if(schoolProfileWidgetIndex !== -1) {
			widgetArray[schoolProfileWidgetIndex].isSync = true;
			widgetArray[schoolProfileWidgetIndex].data = data;

			binding.set('widgetArray', Immutable.fromJS(widgetArray));
		}
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
		const draggingWidget = Object.assign({}, widgetArray[moveResult.whoDroppedIndex]);
		const replacingWidget = Object.assign({}, widgetArray[moveResult.whereDroppedIndex]);

		// insert
		widgetArray.splice(moveResult.whereDroppedIndex, 0, draggingWidget);
		if(moveResult.whereDroppedIndex - moveResult.whoDroppedIndex === -1) {
			// case when we move widget by index 4 to place by index 3
			// we must insert widget to new position and remove widget from old position with one point correction
			// remove old dragging widget
			widgetArray.splice(
				moveResult.whoDroppedIndex + 1,
				1);
		} else {
			// remove replaced widget
			widgetArray.splice(
				moveResult.whereDroppedIndex + 1,
				1);

			// insert replaced widget
			widgetArray.splice(moveResult.whoDroppedIndex, 0, replacingWidget);
			// remove old dragging widget
			widgetArray.splice(
				moveResult.whoDroppedIndex + 1,
				1);
		}

		binding.set('widgetArray', Immutable.fromJS(widgetArray));
		this.saveDashboardStateToLocalStorage();
	},
	handleChangeDashboardViewMode(viewModeId: DASHBOARD_VIEW_MODE) {
		this.getDefaultBinding().set('dashboardModeView', Immutable.fromJS(viewModeId));
		this.getDefaultBinding().set('widgetArray', Immutable.fromJS(this.getDefaultWidgetsStateByDashboardViewMode(viewModeId)));
		this.updateWidgetArrayData().then(() => this.saveDashboardStateToLocalStorage());
	},
	render() {
		return (
			<div className="bDashboardMainPage">
				<Dashboard
					widgetArray={this.getWidgetArray()}
					selectedViewModeDropdownItemId={this.getDefaultBinding().toJS('dashboardModeView')}
					handleChangeDashboardViewMode={(viewModeId: DASHBOARD_VIEW_MODE) => this.handleChangeDashboardViewMode(viewModeId)}
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