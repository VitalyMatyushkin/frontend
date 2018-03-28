import * as React from 'react';
import { DragSource } from 'react-dnd';

import 'styles/ui/dashboard/main_components/dashboard_card.scss'
import 'styles/ui/dashboard/main_components/dashboard_card_col.scss'

export interface DashboardCardProps {
	connectDragSource: any
	isDragging: any
	connectDragPreview: any
	bootstrapWrapperStyle: string,
	headerText: string,
	children: any,
	moveSubject: (item: any, dropResult: any) => any
}

const subjectSource = {
	beginDrag(props, monitor, component) {
		return props;
	},
	endDrag(props, monitor, component) {
		if (!monitor.didDrop()) {
			return;
		}
		const item = monitor.getItem();
		const dropResult = monitor.getDropResult();

		props.moveSubject(item, dropResult);
	},
};

function collect(connect, monitor) {
	return {
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging(),
		connectDragPreview: connect.dragPreview(),
	};
}

export class DashboardCard extends React.Component<DashboardCardProps, {}> {
	getCardColStyle(): string {
		return `bDashboardCardCol ${this.props.bootstrapWrapperStyle}`;
	}

	render() {
		const { connectDragSource } = this.props;

		return connectDragSource(
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

export default DragSource('dashboardCard', subjectSource, collect)(DashboardCard);