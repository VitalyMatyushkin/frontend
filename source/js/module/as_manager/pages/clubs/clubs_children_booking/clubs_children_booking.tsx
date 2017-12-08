import * as React from 'react';
import { ClubBookingChildModel } from "module/as_manager/pages/clubs/clubs_children_booking/club_booking_child/club_booking_child_model";
import { ClubsChildrenBookingTable } from "module/as_manager/pages/clubs/clubs_children_booking/clubs_children_booking_table/clubs_children_booking_table";
import { ClubsChildrenBookingActionArea } from "module/as_manager/pages/clubs/clubs_children_booking/clubs_children_booking_action_area/clubs_children_booking_action_area";

const Style = require('styles/bootstrap-custom.scss');

export interface ClubsChildrenBookingProps {
	children:           ClubBookingChildModel[]
	handleSendMessages: () => any
}

export class ClubsChildrenBooking extends React.Component<ClubsChildrenBookingProps, {}> {

	render() {
		return (
			<div>
				<ClubsChildrenBookingActionArea
					handleSendMessages = { () => this.props.handleSendMessages() }
				/>
				<ClubsChildrenBookingTable
					children = { this.props.children }
				/>
			</div>
		);
	}
}