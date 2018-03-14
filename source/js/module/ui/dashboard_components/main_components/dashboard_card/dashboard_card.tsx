import * as React from 'react';

import 'styles/ui/dashboard/main_components/dashboard_card.scss'
import 'styles/ui/dashboard/main_components/dashboard_card_col.scss'

const DEFAULT_CARD_COL_WIDTH = 6;

export interface DashboardCardProps {
	bootstrapWidth?: number,
	headerText: string,
	children: any
}

export class DashboardCard extends React.Component<DashboardCardProps, {}> {
	getCardWidth(): number {
		return typeof this.props.bootstrapWidth !== 'undefined' ?
			this.props.bootstrapWidth : DEFAULT_CARD_COL_WIDTH;
	}

	getCardColStyle(): string {
		return `bDashboardCardCol mCol-${this.getCardWidth()}`;
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