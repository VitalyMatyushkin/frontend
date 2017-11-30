import * as React from 'react';

import { ClubBookingChildModel } from "module/as_manager/pages/clubs/clubs_children_booking/club_booking_child/club_booking_child_model";

import { ClubsChildrenBookingTableHead } from "module/as_manager/pages/clubs/clubs_children_booking/clubs_children_booking_table/clubs_children_booking_table_head";
import { ClubsChildrenBookingTableBody } from "module/as_manager/pages/clubs/clubs_children_booking/clubs_children_booking_table/clubs_children_booking_table_body";

const Style = require('styles/bootstrap-custom.scss');

export interface ClubsChildrenBookingTableProps {
	children: ClubBookingChildModel[]
}

export class ClubsChildrenBookingTable extends React.Component<ClubsChildrenBookingTableProps, {}> {

	render() {
		return (
			<table className="table table-striped table-bordered">
				<ClubsChildrenBookingTableHead/>
				<ClubsChildrenBookingTableBody
					children    = { this.props.children }
				/>
			</table>
		);
	}
}