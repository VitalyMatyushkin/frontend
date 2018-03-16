import * as React from 'react';

import 'styles/ui/dashboard/main_components/dashboard_button_col.scss'
import 'styles/ui/dashboard/main_components/dashboard_info_button.scss'

const DEFAULT_BUTTON_COL_WIDTH = 3;

export interface DashboardInfoButtonProps {
	handleClick: () => void
	bootstrapWidth?: number
	text: string
}

export class DashboardInfoButton extends React.Component<DashboardInfoButtonProps, {}> {
	getButtonWidth(): number {
		return typeof this.props.bootstrapWidth !== 'undefined' ?
			this.props.bootstrapWidth : DEFAULT_BUTTON_COL_WIDTH;
	}

	getButtonColStyle(): string {
		return `bDashboardButtonСol mCol-${this.getButtonWidth()}`;
	}

	render() {
		return (
			<div className={this.getButtonColStyle()}>
				<button
					className='bDashboardInfoButton'
					onClick={this.props.handleClick}
				>
					{this.props.text}
				</button>
			</div>
		);
	}
}