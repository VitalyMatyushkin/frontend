import * as React from 'react'

import { DropTarget } from 'react-dnd'

import 'styles/ui/dashboard/dasbboard_drop_section.scss'

export interface DashboardDropSectionProps {
	// props from dnd lib
	connectDropTarget: (any) => any
	isOver: any

	index: number
	handleDroppedWidget: (moveResult: any) => void
}

const collect = (connect, monitor) => {
	return {
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver(),
	};
};

const DashboardDropSectionTarget = {
	drop(props) {
		return {
			whereDroppedIndex: props.index
		};
	},
	canDrop() {
		// always can drop
		return true;
	},
};

class DashboardDropSection extends React.Component<DashboardDropSectionProps, {}> {
	renderChildren() {
		const styles = this.props.isOver ? { opacity: 0.7 } : null;

		return <div className='bDashboardDropSection' style={styles}>{this.props.children}</div>;
	}
	render() {
		return this.props.connectDropTarget(this.renderChildren());
	}
}

export default DropTarget('dashboardCard', DashboardDropSectionTarget, collect)(DashboardDropSection);