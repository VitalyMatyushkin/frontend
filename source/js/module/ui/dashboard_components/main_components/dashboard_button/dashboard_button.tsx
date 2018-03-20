import * as React from 'react';

import 'styles/ui/dashboard/main_components/dashboard_button.scss'

export interface DashboardButtonProps {
	handleClick: () => void,
	extraStyle?: string
	text: string
}

export class DashboardButton extends React.Component<DashboardButtonProps, {}> {
	getExtraStyle() {
		return typeof this.props.extraStyle !== 'undefined' ? ' ' + this.props.extraStyle : '';
	}
	render() {
		return (
			<button
				className={'bDashboardButton' + this.getExtraStyle()}
				onClick={this.props.handleClick}
			>
				{this.props.text}
			</button>
		);
	}
}