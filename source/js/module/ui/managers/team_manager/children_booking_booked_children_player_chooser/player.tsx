import * as React from 'react'
import * as classNames from 'classnames'
import { ClubsChildrenBookingHelper } from "module/as_manager/pages/clubs/clubs_children_booking/clubs_children_booking_helper/clubs_children_booking_helper";
import {BookedChildrenStudent} from "module/ui/managers/models/booked_children_student";

export interface PlayerProps {
	player: BookedChildrenStudent,
	handleClickStudent: (playerId: string) => void
}

export interface PlayerState {
	isSelected: boolean
}

export class Player extends React.Component<PlayerProps, PlayerState> {
	componentWillMount() {
		this.setState({
			isSelected: false
		});
	}

	handleClickPlayer() {
		this.setState({
			isSelected: !this.state.isSelected
		});

		this.props.handleClickStudent(this.props.player.id);
	}

	render() {
		const player = this.props.player;
		const formName = typeof player.form !== 'undefined' ? player.form.name : '';
		const houseName = typeof player.house !== 'undefined' ? player.house.name : '';
		const parents = typeof player.parents !== 'undefined' ? player.parents.join(',') : '';
		const messageStatus = typeof player.messageStatus !== 'undefined' ?
			ClubsChildrenBookingHelper.getClientMessageStatusValueByServerValue(player.messageStatus) :
			'';

		const style = classNames({
			bBookedChildrenPlayer:	true,
			mSelected:				this.state.isSelected
		});

		return (
			<tr
				onClick     = { () => this.handleClickPlayer() }
				className   = { style }
			>
				<td className="col-md-3">
					{`${player.firstName} ${player.lastName}`}
				</td>
				<td className="col-md-2">
					{ formName }
				</td>
				<td className="col-md-2">
					{ houseName }
				</td>
				<td className="col-md-3">
					{ parents }
				</td>
				<td className="col-md-2">
					{ messageStatus }
				</td>
			</tr>
		);
	}
};