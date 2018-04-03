import * as React from 'react';
import { DragSource } from 'react-dnd';
import { Resizable, ResizableBox } from 'react-resizable';

import 'styles/ui/dashboard/main_components/dashboard_card.scss'

export interface MoveResult {
	whoDroppedIndex: number,    // index of current widget in widget array, so also it's old place of widget
	whereDroppedIndex: number   // index of new place for widget
}

export interface DashboardCardHeaderProps {
	// props from dnd lib
	connectDragSource: any
	isDragging: boolean
	connectDragPreview: any

	index: number
	headerText: string
	handleDroppedWidget: (moveResult: MoveResult) => void
	canDrag: boolean
	handlePin: () => void
	handleMinimize: () => void
}

const subjectSource = {
	beginDrag(props: DashboardCardHeaderProps, monitor, component) {
		return props;
	},
	canDrag(props: DashboardCardHeaderProps, monitor) {
		return props.canDrag;
	},
	endDrag(props: DashboardCardHeaderProps, monitor, component) {
		if (!monitor.didDrop()) {
			return;
		}
		const dropResult = monitor.getDropResult();

		props.handleDroppedWidget({
			whoDroppedIndex: props.index,
			whereDroppedIndex: dropResult.whereDroppedIndex
		});
	},
};

function collect(connect, monitor) {
	return {
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging(),
		connectDragPreview: connect.dragPreview(),
	};
}

class DashboardCardHeader extends React.Component<DashboardCardHeaderProps, {}> {
	getStyleForPinControl() {
		let style = 'eDashboardCard_control';

		if(!this.props.canDrag) {
			style += ' mActive'
		}

		return style;
	}
	render() {
		const { connectDragSource } = this.props;

		return connectDragSource(
			<div className='eDashboardCard_header'>
				<div className='eDashboardCard_headerTextWrapper'>
					<h4 className='eDashboardCard_headerText'>
						{this.props.headerText}
					</h4>
				</div>
				<div className='eDashboardCard_controls'>
					<div className='eDashboardCard_control mMarginRight'>
						<i onClick={this.props.handleMinimize} className="fa fa-minus" aria-hidden="true"/>
					</div>
					<div className={this.getStyleForPinControl()}>
						<i onClick={this.props.handlePin} className="fa fa-thumb-tack" aria-hidden="true"/>
					</div>
				</div>
			</div>
		);
	}
}

export default DragSource('dashboardCard', subjectSource, collect)(DashboardCardHeader);