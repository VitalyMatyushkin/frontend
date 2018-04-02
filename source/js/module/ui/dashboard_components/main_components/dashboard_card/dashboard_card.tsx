import * as React from 'react';
import { DragSource } from 'react-dnd';
import { Resizable, ResizableBox } from 'react-resizable';
import DashboardCardHeader, {MoveResult} from "module/ui/dashboard_components/main_components/dashboard_card/dashboard_card_header";

import 'styles/ui/dashboard/main_components/dashboard_card.scss'
import 'styles/ui/dashboard/main_components/dashboard_card_col.scss'

export interface DashboardCardProps {
	width?: number
	height?: number
	index: number
	headerText: string,
	handleDroppedWidget: (moveResult: MoveResult) => void,
	// TODO Remove
	bootstrapWrapperStyle?: string
	handleResize?: (deltaPoints: number) => void
}

export interface DashboardCardState {
	oldWidth?: number
	resizingWidth?: number
	resizingHeight?: number
	isResizing: boolean
}

export class DashboardCard extends React.Component<DashboardCardProps, DashboardCardState> {
	card = undefined;
	componentWillMount() {
		this.setState({
			oldWidth: undefined,
			resizingWidth: undefined,
			isResizing: false
		});
	}
	getCardStyle() {
		let style = 'bDashboardCard';

		if(this.state.isResizing) {
			style += ' mAbsolute';
		}

		return style;
	}
	getWidth() {
		if(this.state.isResizing) {
			return this.state.resizingWidth;
		} else {
			return this.props.width;
		}
	}
	handleResize(e, {element, size}) {
		this.setState({resizingWidth: size.width});
		console.log('RESIZE:');
		console.log(this.state);
	}
	handleResizeStart(e, {element, size}) {
		this.setState({
			oldWidth: size.width,
			resizingWidth: size.width,
			isResizing: true
		});
		console.log('RESIZE START:');
		console.log(this.state);
	}
	handleResizeStop(e, {element, size}) {
		const oldWidth = this.state.oldWidth;
		const newWidth = size.width;
		const delta = newWidth - oldWidth;
		const deltaPoints = Math.floor(delta / 100);

		this.props.handleResize(deltaPoints);

		this.setState({
			oldWidth: undefined,
			resizingWidth: undefined,
			isResizing: false
		});
	}
	render() {
		const width = this.getWidth();
		const style = {width};

		return (
			<Resizable
				width={width}
				height={300}

				minConstraints={[253, 253]}
				maxConstraints={[1100, 600]}

				onResize={(e, {element, size}) => this.handleResize(e, {element, size})}
				onResizeStart={(e, {element, size}) => this.handleResizeStart(e, {element, size})}
				onResizeStop={(e, {element, size}) => this.handleResizeStop(e, {element, size})}
			>
				<div
					ref={(card) => { this.card = card; }}
					className={this.getCardStyle()}
					style={style}
				>
					<DashboardCardHeader
						index = {this.props.index}
						headerText = {this.props.headerText}
						handleDroppedWidget = {this.props.handleDroppedWidget}
					/>
					<div className='eDashboardCard_body'>
						{this.props.children}
					</div>
				</div>
			</Resizable>
		);
	}
}

export default DashboardCard;