import * as React from 'react';
import { ClubBookingChildModel } from "module/as_manager/pages/clubs/clubs_children_booking/club_booking_child/club_booking_child_model";
import { ClubsChildrenBookingTable } from "module/as_manager/pages/clubs/clubs_children_booking/clubs_children_booking_table/clubs_children_booking_table";

const Style = require('styles/bootstrap-custom.scss');

export interface ClubsChildrenBookingProps {
	children: ClubBookingChildModel[]
}

export class ClubsChildrenBooking extends React.Component<ClubsChildrenBookingProps, {}> {

	render() {
		return (
			<div>
				<ClubsChildrenBookingTable
					children = { this.props.children }
				/>
			</div>
		);
	}
}