import * as React from 'react';

import 'styles/ui/dashboard/dashboard_data_widget/dashboard_data_widget.scss'
import {DataItem} from "module/ui/dashboard_components/dashboard_data_widget/dashboard_data_widget";

export interface DashboardDataWidgetDataItemProps {
	dataItem: DataItem
}

export class DashboardDataWidgetDataItem extends React.Component<DashboardDataWidgetDataItemProps, {}> {
	render() {
		return (
			<div className='eDashboardDataWidget_dataItem'>
				<div className='eDashboardDataWidget_dataCol mLong'>
					{this.props.dataItem.name}
				</div>
				<div className='eDashboardDataWidget_dataCol mShort mTextRight'>
					{this.props.dataItem.value}
				</div>
			</div>
		);
	}
}