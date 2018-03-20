import * as React from 'react';

import 'styles/ui/dashboard/dashboard_data_widget/dashboard_data_widget.scss'
import {DataItem} from "module/ui/dashboard_components/dashboard_data_widget/dashboard_data_widget";
import {DashboardButton} from "module/ui/dashboard_components/main_components/dashboard_button/dashboard_button";

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
			case typeof this.props.dataItem.button !== 'undefined': {
				return (
					<div className={'eDashboardDataWidget_dataCol m-5-width mNoneBorder' + this.getExtraStyle()}>
						<DashboardButton
							text={this.props.dataItem.button.text}
							extraStyle={this.props.dataItem.button.extraStyle}
							handleClick={this.props.dataItem.button.handleClick}
						/>
					</div>
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
				<div className={'eDashboardDataWidget_dataCol m-8-width' + this.getExtraStyle()}>
					{this.props.dataItem.name}
				</div>
				<div className={'eDashboardDataWidget_dataCol m-4-width mTextRight' + this.getExtraStyle()}>
					{this.props.dataItem.value}
				</div>
				{this.renderButton()}
			</div>
		);
	}
}