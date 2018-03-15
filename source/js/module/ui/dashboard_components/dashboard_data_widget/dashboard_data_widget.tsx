import * as React from 'react';

import {DashboardDataWidgetDataList} from "module/ui/dashboard_components/dashboard_data_widget/components/dashboard_data_widget_data_list";

import 'styles/ui/dashboard/dashboard_data_widget/dashboard_data_widget.scss'

export interface Data {
	dataItems: DataItem[]
}

export interface DataItem {
	name: string,
	value: string
}

export interface DashboardDataWidgetProps {
	data: Data
}

export class DashboardDataWidget extends React.Component<DashboardDataWidgetProps, {}> {
	render() {
		return (
			<div className='bDashboardDataWidget'>
				<DashboardDataWidgetDataList data={this.props.data}/>
			</div>
		);
	}
}