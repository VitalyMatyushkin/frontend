import * as React from 'react'

import {Player} from 'module/ui/managers/team_manager/default_player_chooser/player'
import { PlayerListHeader } from "module/ui/managers/team_manager/default_player_chooser/player_list_header";
import {DefaultStudent} from "module/ui/managers/models/default_student";

export interface PlayerListProps {
	players: DefaultStudent[],
	handleClickStudent: (playerId: string) => void
}

export class PlayersList extends React.Component<PlayerListProps, {}> {
	render() {
		return (
			<div className="ePlayerChooser_playerList">
				<table className="table table-hover">
					<PlayerListHeader/>
					<tbody>
						{
							this.props.players.map(player =>
								<Player
									key={player.id}
									player={player}
									handleClickStudent={this.props.handleClickStudent}
								/>
							)
						}
					</tbody>
				</table>
			</div>
		);
	}
};