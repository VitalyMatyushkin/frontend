import * as React from 'react';

import {DashboardDataWidgetDataItem} from "module/ui/dashboard_components/dashboard_data_widget/components/dashboard_data_widget_data_item";
import {Data} from "module/ui/dashboard_components/dashboard_data_widget/dashboard_data_widget";

import 'styles/ui/dashboard/dashboard_data_widget/dashboard_data_widget.scss'

export interface DashboardDataWidgetDataListProps {
	data: Data
}

export class DashboardDataWidgetDataList extends React.Component<DashboardDataWidgetDataListProps, {}> {
	render() {
		return (
			<div className='eDashboardDataWidget_dataList'>
				{this.props.data.dataItems.map(item => <DashboardDataWidgetDataItem dataItem={item}/>)}
			</div>
		);
	}
}