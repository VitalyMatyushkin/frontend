import * as React from 'react';

import 'styles/ui/dashboard/main_components/dashboard_card_col.scss'
import DashboardCard, {MoveResult} from "module/ui/dashboard_components/main_components/dashboard_card/dashboard_card";

const BOOTSTRAP_PADDING = 30;

export interface DashboardCardColProps {
	index: number
	headerText: string
	handleDroppedWidget: (moveResult: MoveResult) => void
	bootstrapWrapperStyle: string
	widget: any
	mdWidth: number
}

export interface DashboardCardColState {
	isSync: boolean,
	width: number,
	delta: number
}

export class DashboardCardCol extends React.Component<DashboardCardColProps, DashboardCardColState> {
	cardCol = undefined;

	componentWillMount() {
		this.setState({
			isSync: false,
			width: 0,
			delta: 0
		});
	}
	componentDidMount() {
		this.setState({
			isSync: true,
			width: this.cardCol.clientWidth - BOOTSTRAP_PADDING
		});
	}
	getCardColStyle(): string {
		return `bDashboardCardCol col-md-${this.props.mdWidth + this.state.delta}`;
	}

	/**
	 * Handle card resize
	 * @param deltaPoints - resize delta. It isn't equal of this.state deltaPoint
	 */
	handleResize(deltaPoints) {
		this.setState({
			isSync: false,
			delta: this.state.delta + deltaPoints
		});

		// a little dirty
		// but we need some time for resize bDashboardCardCol by delta changes
		// and only after this we should calculate new with of component
		// in other way we get old value
		setTimeout(() => {
			this.setState({
				isSync: true,
				width: this.cardCol.clientWidth - BOOTSTRAP_PADDING
			});
		}, 100);
	}
	render() {
		return (
			<div
				ref={(cardCol) => { this.cardCol = cardCol; }}
	            className={this.getCardColStyle()}
			>
				{
					this.state.isSync ?
						<DashboardCard
							width={this.state.width}
							index={this.props.index}
							headerText={this.props.headerText}
							handleDroppedWidget={this.props.handleDroppedWidget}
							handleResize={(deltaPoints) => this.handleResize(deltaPoints)}
						>
							{this.props.widget}
						</DashboardCard> :
						null
				}
			</div>
		);
	}
}