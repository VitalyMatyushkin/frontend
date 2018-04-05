import * as React from 'react';
import { DragSource } from 'react-dnd';
import { Resizable, ResizableBox } from 'react-resizable';
import DashboardCardHeader, {MoveResult} from "module/ui/dashboard_components/main_components/dashboard_card/dashboard_card_header";

import 'styles/ui/dashboard/main_components/dashboard_card.scss'
import 'styles/ui/dashboard/main_components/dashboard_card_col.scss'

export interface DashboardCardProps {
	colWidth: number
	width: number
	index: number
	headerText: string,
	handleDroppedWidget: (moveResult: MoveResult) => void,
	handleResize: (deltaPoints: number) => void
	minSizeConstraints?: [number, number]
}

export interface DashboardCardState {
	oldWidth?: number
	resizingWidth?: number
	resizingHeight?: number
	isResizing: boolean
	canDrag: boolean
	isMinimize: boolean
}

// just plug for resizable component
// real height of component does't equal it
// About values - it's good size for cute widget fit
const HEIGHT_PLUG = 300;
const MIN_SIZE_CONSTARINATS = [253, 253];
const MAX_SIZE_CONSTARAINTS = [1100, 600];

export class DashboardCard extends React.Component<DashboardCardProps, DashboardCardState> {
	card = undefined;
	componentWillMount() {
		this.setState({
			oldWidth: undefined,
			resizingWidth: undefined,
			isResizing: false,
			canDrag: true,
			isMinimize: false
		});
	}
	getCardStyle() {
		let style = 'bDashboardCard';

		if(this.state.isResizing) {
			style += ' mAbsolute';
		}

		if(this.state.isMinimize || !this.state.canDrag) {
			style += ' mDisable';
		}

		return style;
	}
	getMinSizeConstraints() {
		if(typeof this.props.minSizeConstraints !== 'undefined') {
			return this.props.minSizeConstraints;
		} else {
			return MIN_SIZE_CONSTARINATS;
		}
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
	}
	handleResizeStart(e, {element, size}) {
		this.setState({
			oldWidth: size.width,
			resizingWidth: size.width,
			isResizing: true
		});
	}
	handleResizeStop(e, {element, size}) {
		const oldWidth = this.state.oldWidth;
		const newWidth = size.width;
		const delta = newWidth - oldWidth;
		const deltaPoints = Math.floor(delta / this.props.colWidth);

		this.props.handleResize(deltaPoints);

		this.setState({
			oldWidth: undefined,
			resizingWidth: undefined,
			isResizing: false
		});
	}
	handlePin() {
		this.setState({
			canDrag: !this.state.canDrag
		});
	}
	handleMinimize() {
		this.setState({
			isMinimize: !this.state.isMinimize
		});
	}
	renderBody() {
		if(this.state.isMinimize) {
			return null;
		} else {
			return (
				<div className='eDashboardCard_body'>
					{this.props.children}
				</div>
			);
		}
	}
	render() {
		const width = this.getWidth();
		const style = {width};

		console.log(this.props.minSizeConstraints);

		return (
			<Resizable
				width={width}
				height={HEIGHT_PLUG}

				minConstraints={this.getMinSizeConstraints()}
				maxConstraints={MAX_SIZE_CONSTARAINTS}

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
						canDrag = {this.state.canDrag}
						handlePin = {() => this.handlePin()}
						handleMinimize = {() => this.handleMinimize()}
					/>
					{this.renderBody()}
				</div>
			</Resizable>
		);
	}
}

export default DashboardCard;