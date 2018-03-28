import * as React from 'react'

import { DropTarget } from 'react-dnd'

import 'styles/ui/dashboard/dashboard_main_page.scss'

export interface DashboardDropSectionProps {
	connectDropTarget: (any) => any
	isOver: any
	xPos: any
	yPos: any
	widget: any
}

const collect = (connect, monitor) => {
	return {
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver(),
	};
};

const DashboardDropSectionTarget = {
	drop(props) {
		return props;
	},
	canDrop() {
		return true;
	},
};

class DashboardDropSection extends React.Component<DashboardDropSectionProps, {}> {
	renderItems() {
		return (
			<div className='eDashboardMainPage_row'>
				{this.props.children}
			</div>
		);
	}
	render() {
		const { connectDropTarget } = this.props;

		return connectDropTarget(this.renderItems());
	}
}

export default DropTarget('dashboardCard', DashboardDropSectionTarget, collect)(DashboardDropSection);