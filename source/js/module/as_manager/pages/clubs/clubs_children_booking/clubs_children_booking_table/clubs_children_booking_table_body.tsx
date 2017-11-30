import * as React from 'react';

import { ClubBookingChild } from "module/as_manager/pages/clubs/clubs_children_booking/club_booking_child/club_booking_child";
import { ClubBookingChildModel } from "module/as_manager/pages/clubs/clubs_children_booking/club_booking_child/club_booking_child_model";

const Style = require('styles/bootstrap-custom.scss');

export interface ClubsChildrenBookingTableBodyProps {
	children: ClubBookingChildModel[]
}

export class ClubsChildrenBookingTableBody extends React.Component<ClubsChildrenBookingTableBodyProps, {}> {

	renderChildren() {
		return this.props.children.map((child, i) =>
			<ClubBookingChild
				key     = {`club_booking_child_${i}`}
				index   = { i }
				child   = { child }
			/>
		);
	}

	render() {
		return (
			<tbody>
				{ this.renderChildren() }
			</tbody>
		);
	}
}