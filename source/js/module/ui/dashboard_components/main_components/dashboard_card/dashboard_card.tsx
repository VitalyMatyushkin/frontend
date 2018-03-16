import * as React from 'react';

import 'styles/ui/dashboard/main_components/dashboard_card.scss'
import 'styles/ui/dashboard/main_components/dashboard_card_col.scss'

const DEFAULT_CARD_COL_WIDTH = 6;

export interface DashboardCardProps {
	bootstrapWrapperStyle: string,
	headerText: string,
	children: any
}

export class DashboardCard extends React.Component<DashboardCardProps, {}> {
	getCardColStyle(): string {
		return `bDashboardCardCol ${this.props.bootstrapWrapperStyle}`;
	}

	render() {
		return (
			<div className={this.getCardColStyle()}>
				<div className='bDashboardCard'>
					<div className='eDashboardCard_header'>
						<h4 className='eDashboardCard_headerText'>
							{this.props.headerText}
						</h4>
					</div>
					<div className='eDashboardCard_body'>
						{this.props.children}
					</div>
				</div>
			</div>
		);
	}
}