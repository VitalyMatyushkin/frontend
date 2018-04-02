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
}

const subjectSource = {
	beginDrag(props: DashboardCardHeaderProps, monitor, component) {
		return props;
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
	render() {
		const { connectDragSource } = this.props;

		return connectDragSource(
			<div className='eDashboardCard_header'>
				<h4 className='eDashboardCard_headerText'>
					{this.props.headerText}
				</h4>
			</div>
		);
	}
}

export default DragSource('dashboardCard', subjectSource, collect)(DashboardCardHeader);