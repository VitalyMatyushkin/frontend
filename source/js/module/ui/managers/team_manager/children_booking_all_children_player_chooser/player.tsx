import * as React from 'react'
import * as classNames from 'classnames'
import {AllChildrenStudent} from "module/ui/managers/models/all_children_student";

export interface PlayerProps {
	player:                 AllChildrenStudent,
	handleClickStudent:     (playerId: string) => void
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
			</tr>
		);
	}
};