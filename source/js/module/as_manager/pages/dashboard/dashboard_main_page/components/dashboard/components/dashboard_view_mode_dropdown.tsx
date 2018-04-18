import * as React from 'react'

import {
	SettingsDropdown,
	SettingsDropdownItemType
} from "module/ui/settings_dropdown/settings_dropdown";

import 'styles/ui/dashboard/dashboard_view_mode_dropdown.scss'

export enum DASHBOARD_VIEW_MODE {
	GetStarted = 'GET_STARTED',
	PeTeacher = 'PE_TEACHER',
	Manager = 'MANAGER'
}

export enum DEFAULT_START_PAGE {
	Dashboard = 'DASHBOARD'
}

export interface DashboardViewModeDropdownProps {
	selectedSettingsDropdownItemId: DASHBOARD_VIEW_MODE,
	isDashboardDefaultPage: boolean,
	handleClickSettingsDropdown: (item) => void
}

export class DashboardViewModeDropdown extends React.Component<DashboardViewModeDropdownProps, {}> {
	getDropdownItemArray() {
		return [
			{
				id: SettingsDropdownItemType.SettingsDropdownTitleItem,
				text: 'Dashboard view mode',
				isSelected: false,
				type: SettingsDropdownItemType.SettingsDropdownTitleItem
			},
			{
				id: DASHBOARD_VIEW_MODE.GetStarted,
				text: 'Get Started',
				isSelected: DASHBOARD_VIEW_MODE.GetStarted === this.props.selectedSettingsDropdownItemId,
				type: SettingsDropdownItemType.SettingsDropdownDefaultItem
			},
			{
				id: DASHBOARD_VIEW_MODE.PeTeacher,
				text: 'Pe Teacher',
				isSelected: DASHBOARD_VIEW_MODE.PeTeacher === this.props.selectedSettingsDropdownItemId,
				type: SettingsDropdownItemType.SettingsDropdownDefaultItem
			},
			{

				id: DASHBOARD_VIEW_MODE.Manager,
				text: 'Manager',
				isSelected: DASHBOARD_VIEW_MODE.Manager === this.props.selectedSettingsDropdownItemId,
				type: SettingsDropdownItemType.SettingsDropdownDefaultItem
			},
			{
				id: SettingsDropdownItemType.SettingsDropdownSeparateLineItem,
				text: '',
				isSelected: false,
				type: SettingsDropdownItemType.SettingsDropdownSeparateLineItem
			},
			{
				id: DEFAULT_START_PAGE.Dashboard,
				text: 'Use Dashboard as my default page',
				isSelected: this.props.isDashboardDefaultPage,
				type: SettingsDropdownItemType.SettingsDropdownDefaultItem
			}
		];
	}
	render() {
		return (
			<div className='bDashboardViewModeDropdown'>
				<SettingsDropdown
					items={this.getDropdownItemArray()}
					handleClickItem={this.props.handleClickSettingsDropdown}
				/>
			</div>
		);
	}
}