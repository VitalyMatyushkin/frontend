import * as React from 'react';

import 'styles/ui/dashboard/dashboard_data_widget/dashboard_data_widget.scss'
import {DataItem} from "module/ui/dashboard_components/dashboard_data_widget/dashboard_data_widget";

export interface DashboardDataWidgetDataItemProps {
	dataItem: DataItem
}

export class DashboardDataWidgetDataItem extends React.Component<DashboardDataWidgetDataItemProps, {}> {
	getExtraStyle() {
		return typeof this.props.dataItem.extraStyle !== 'undefined' ?
			' ' + this.props.dataItem.extraStyle :
			'';
	}
	renderButton() {
		switch (true) {
			case typeof this.props.dataItem.icon !== 'undefined': {
				return (
					<i
						className={`eDashboardDataWidget_icon fa ${this.props.dataItem.icon.iconStyle} ${this.getExtraStyle()}`}
						aria-hidden="true"
						onClick={this.props.dataItem.icon.handleClick}
					/>
				);
			}
			default: {
				return null;
			}
		}
	}
	render() {
		return (
			<div className={'eDashboardDataWidget_dataItem' + this.getExtraStyle()}>
				<div className={'eDashboardDataWidget_dataCol m-7-width' + this.getExtraStyle()}>
					{this.props.dataItem.name}
				</div>
				<div className={'eDashboardDataWidget_dataCol m-5-width mTextRight' + this.getExtraStyle()}>
					{this.props.dataItem.value}
					{this.renderButton()}
				</div>
			</div>
		);
	}
}