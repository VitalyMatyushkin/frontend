import * as React from 'react'

import { PlayerListHeader } from "module/ui/managers/team_manager/children_booking_booked_children_player_chooser/player_list_header";
import { Player } from "module/ui/managers/team_manager/children_booking_booked_children_player_chooser/player";

export interface PlayerListProps {
	players:                any[],
	handleClickStudent:     (playerId: string) => void
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
								key					= { player.id }
								player				= { player }
								handleClickStudent	= { playerId => this.props.handleClickStudent(playerId) }
							/>
						)
					}
					</tbody>
				</table>
			</div>
		);
	}
};