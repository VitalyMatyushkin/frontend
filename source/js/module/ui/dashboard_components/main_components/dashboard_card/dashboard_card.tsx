import * as React from 'react';
import { DragSource } from 'react-dnd';

import 'styles/ui/dashboard/main_components/dashboard_card.scss'
import 'styles/ui/dashboard/main_components/dashboard_card_col.scss'

export interface DashboardCardProps {
	bootstrapWrapperStyle: string,
	headerText: string,
	children: any
}

const subjectSource = {
	beginDrag(props, monitor, component) {
		return props;
	},
	endDrag(props, monitor, component) {
		return props;
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

export default DragSource('dashboardCard', subjectSource, collect)(DashboardCard);