import * as React from 'react';
import {ClubBookingChildModel} from "module/as_manager/pages/clubs/clubs_children_booking/club_booking_child/club_booking_child_model";

const Style = require('styles/bootstrap-custom.scss');

export interface ClubBookingChildProps {
	key:    string,
	index:  number,
	child:  ClubBookingChildModel
}

export class ClubBookingChild extends React.Component<ClubBookingChildProps, {}> {
	render() {
		return (
			<tr key={this.props.index}>
				<th scope="row">{this.props.index + 1}</th>
				<td>
					{ this.props.child.childName }
				</td>
				<td>
					{ this.props.child.formName }
				</td>
				<td>
					{ this.props.child.houseName }
				</td>
				<td>
					{ this.props.child.parentName }
				</td>
				<td>
					{ this.props.child.messageStatus }
				</td>
			</tr>
		);
	}
}