import * as React from 'react'
import * as classNames from 'classnames'
import {DefaultStudent} from "module/ui/managers/models/default_student";

export interface PlayerProps {
	player: DefaultStudent,
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
		const playerClass = classNames({
			ePlayerChooser_player: true,
			mSelected: this.state.isSelected
		});
		const formName = typeof player.form !== 'undefined' ? player.form.name : '';

		return (
			<tr
				className={playerClass}
				onClick={() => this.handleClickPlayer()}
			>
				<td className="col-md-4">
					{`${player.firstName} ${player.lastName}`}
				</td>
				<td className="col-md-3">
					{formName}
				</td>
			</tr>
		);
	}
};