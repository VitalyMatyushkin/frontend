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

	getMessageStatus() {
		let messageStatus = '';

		const player = this.props.player;

		const serverValueMessageStatus = player.messageStatus;
		switch (true) {
			case (
				serverValueMessageStatus === 'NOT_SENT' &&
				(typeof player.parents === 'undefined' || player.parents.length === 0)
			): {

				messageStatus = 'N/A';
				break;
			}
			case typeof player.messageStatus !== 'undefined': {
				messageStatus = ClubsChildrenBookingHelper.getClientMessageStatusValueByServerValue(player.messageStatus);
				break;
			}
		}


		return messageStatus;
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
		const parents = typeof player.parents !== 'undefined' ? player.parents.join(',') : '';

		const style = classNames({
			bBookedChildrenPlayer: true,
			mSelected: this.state.isSelected
		});

		return (
			<tr
				onClick={() => this.handleClickPlayer()}
				className={style}
			>
				<td className="col-md-4">
					{`${player.firstName} ${player.lastName}`}
				</td>
				<td className="col-md-2">
					{ formName }
				</td>
				<td className="col-md-3">
					{ parents }
				</td>
				<td className="col-md-3">
					{ this.getMessageStatus() }
				</td>
			</tr>
		);
	}
};