import * as React from 'react';

import 'styles/ui/dashboard/main_components/dashboard_card_col.scss'
import DashboardCard from "module/ui/dashboard_components/main_components/dashboard_card/dashboard_card";
import {MoveResult} from "module/ui/dashboard_components/main_components/dashboard_card/dashboard_card_header";

const BOOTSTRAP_PADDING = 30;

export interface DashboardCardColProps {
	index: number
	colWidth: number
	headerText: string
	handleDroppedWidget: (moveResult: MoveResult) => void
	widget: any
	mdWidth: number
	smWidth: number
	xsWidth: number
	minSizeConstraints?: [number, number]
	handlePinWidget: () => void
	handleMinimizeWidget: () => void
	handleResize: (delta) => void
	isPin: boolean
	isMinimize: boolean
	delta: number
}

export interface DashboardCardColState {
	isSync: boolean,
	width: number
}

const CONSTRAINTS_MD_WIDTH = 3;
const CONSTRAINTS_SM_WIDTH = 3;
const CONSTRAINTS_XS_WIDTH = 3;

export class DashboardCardCol extends React.Component<DashboardCardColProps, DashboardCardColState> {
	cardCol = undefined;

	componentWillMount() {
		this.setState({
			isSync: false,
			width: 0
		});
	}
	componentDidMount() {
		this.setState({
			isSync: true,
			width: this.cardCol.clientWidth - BOOTSTRAP_PADDING
		});
	}
	getCardColStyle(): string {
		let mdWidth = this.props.mdWidth + this.props.delta;
		if(mdWidth < CONSTRAINTS_MD_WIDTH) {
			mdWidth = CONSTRAINTS_MD_WIDTH;
		}

		let smWidth = this.props.smWidth + this.props.delta;
		if(smWidth < CONSTRAINTS_SM_WIDTH) {
			smWidth = CONSTRAINTS_SM_WIDTH;
		}

		let xsWidth = this.props.xsWidth + this.props.delta;
		if(xsWidth < CONSTRAINTS_XS_WIDTH) {
			xsWidth = CONSTRAINTS_SM_WIDTH;
		}

		return `bDashboardCardCol col-md-${mdWidth} col-sm-${smWidth} col-xs-${xsWidth}`;
	}

	/**
	 * Handle card resize
	 * @param deltaPoints - resize delta. It isn't equal of this.state deltaPoint
	 */
	handleResize(deltaPoints) {
		this.setState({
			isSync: false
		});

		this.props.handleResize(this.props.delta + deltaPoints);

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
							isPin={this.props.isPin}
							isMinimize={this.props.isMinimize}
							handlePinWidget={this.props.handlePinWidget}
							handleMinimizeWidget={this.props.handleMinimizeWidget}
							colWidth={this.props.colWidth}
							width={this.state.width}
							index={this.props.index}
							headerText={this.props.headerText}
							handleDroppedWidget={this.props.handleDroppedWidget}
							handleResize={(deltaPoints) => this.handleResize(deltaPoints)}
							minSizeConstraints={this.props.minSizeConstraints}
						>
							{this.props.widget}
						</DashboardCard> :
						null
				}
			</div>
		);
	}
}