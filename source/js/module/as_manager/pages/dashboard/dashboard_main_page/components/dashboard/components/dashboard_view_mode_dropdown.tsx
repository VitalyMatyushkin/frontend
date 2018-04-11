import * as React from 'react'

import {Dropdown, Item} from "module/ui/dropdown/dropdown";

import 'styles/ui/dashboard/dashboard_view_mode_dropdown.scss'

export enum DASHBOARD_VIEW_MODE {
	GET_STARTED = 'Get started',
	PE_TEACHER = 'PE Teacher',
	MANAGER = 'Manager'
}

export interface DashboardViewModeDropdownProps {
	selectedViewModeDropdownItemId: DASHBOARD_VIEW_MODE
	handleChangeViewMode: (item: DASHBOARD_VIEW_MODE) => void
}

export const DASHBOARD_VIEW_MODE_DROPDOWN_ITEMS: Item[] = [
	{
		id: DASHBOARD_VIEW_MODE.GET_STARTED,
		element: <div>{DASHBOARD_VIEW_MODE.GET_STARTED}</div>
	}, {
		id: DASHBOARD_VIEW_MODE.PE_TEACHER,
		element: <div>{DASHBOARD_VIEW_MODE.PE_TEACHER}</div>
	}, {
		id: DASHBOARD_VIEW_MODE.MANAGER,
		element: <div>{DASHBOARD_VIEW_MODE.MANAGER}</div>
	}
];

export class DashboardViewModeDropdown extends React.Component<DashboardViewModeDropdownProps, {}> {
	render() {
		return (
			<div className='bDashboardViewModeDropdown'>
				<h4 className='eDashboardViewModeDropdown_label'>
					Change view mode
				</h4>
				<Dropdown
					extraStyle='mMain'
					selectedItemId={this.props.selectedViewModeDropdownItemId}
					handleClickItem={this.props.handleChangeViewMode}
					items={DASHBOARD_VIEW_MODE_DROPDOWN_ITEMS}
				/>
			</div>
		);
	}
}