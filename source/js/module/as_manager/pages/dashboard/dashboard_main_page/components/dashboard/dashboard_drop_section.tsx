import * as React from 'react'

import { DropTarget } from 'react-dnd'

import 'styles/ui/dashboard/dasbboard_drop_section.scss'

export interface DashboardDropSectionProps {
	// props from dnd lib
	connectDropTarget: (any) => any
	isOver: boolean

	index: number
	handleDroppedWidget: (moveResult: any) => void
	canDrop: boolean
}

function  collect(connect, monitor) {
	return {
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver(),
	};
};

const DashboardDropSectionTarget = {
	drop(props: DashboardDropSectionProps) {
		return {
			whereDroppedIndex: props.index
		};
	},
	canDrop(props: DashboardDropSectionProps) {
		console.log(props.canDrop);
		return props.canDrop;
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