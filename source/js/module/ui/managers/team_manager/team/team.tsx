import * as React from 'react';
import {Player, PlayerStruct} from './player';
import {ErrorItem} from './errorItem';
import {RemovePlayersButton} from './remove_players_button';

import '../../../../../../styles/ui/mangers/b_team.scss';
import {Position} from "./playerPositionsColumn";

export interface TeamProps {
	// TODO it's wrong way. we need a new type for team component. but time is a money.
	isClubPage?:                     boolean
	players:						PlayerStruct[]
	positions:						Position[]
	handleClickPlayer:				(playerId: string) => void
	handleChangePlayerPosition:		(playerId: string, newPositionId: string) => void
	handleClickPlayerSub:			(playerId: string, isSub: boolean) => void
	handleClickRemovePlayerButton:	() => void
	handleClickPlayerIsCaptain:		(playerId: string, isCaptain: boolean) => void
	isNonTeamSport:					boolean
	isRemovePlayerButtonBlock:		boolean
	error:							{
		isError: boolean
		text: string
	}
}

export class Team extends React.Component<TeamProps, {}> {
	renderTeamTableHead() {
		return (
			<thead>
			<tr>
				<th>#</th>
				<th>Name</th>
				<th>Form</th>
				<th>Position</th>
				<th>Captain</th>
				<th>Sub</th>
			</tr>
			</thead>
		);
	}

	renderNonTeamTableHead() {
		return (
			<thead>
			<tr>
				<th>#</th>
				<th className='col-md-8'>Name</th>
				<th className='col-md-4'>Form</th>
			</tr>
			</thead>
		);
	}

	renderClubTableHead() {
		return (
			<thead>
			<tr>
				<th>#</th>
				<th className='col-md-4'>Name</th>
				<th className='col-md-4'>Form</th>
				<th className='col-md-4'>Invitation Status</th>
			</tr>
			</thead>
		);
	}

	renderTableHead() {
		if(typeof this.props.isClubPage === 'boolean' && this.props.isClubPage) {
			return this.renderClubTableHead()
		} else if(this.props.isNonTeamSport) {
			return this.renderNonTeamTableHead();
		} else {
			return this.renderTeamTableHead();
		}
	}

	renderPlayers() {
		const { players, positions } = this.props;

		let playersViewArray = [];  // TODO: which types are here??

		if(this.props.error.isError && this.props.error.text !== 'Please enter team name') {
			playersViewArray.push(
				<ErrorItem errorText={this.props.error.text}/>
			);
		}

		playersViewArray = playersViewArray.concat(players.map((player, index) =>
			<Player
				isClubPage                  = {this.props.isClubPage}
				number						= {index + 1}
				key							= {player.id}
				isNonTeamSport				= {this.props.isNonTeamSport}
				player						= {player}
				positions					= {positions}
				handleClickPlayer			= {this.props.handleClickPlayer}
				handleChangePlayerPosition	= {this.props.handleChangePlayerPosition}
				handleClickPlayerSub		= {this.props.handleClickPlayerSub}
				handleClickPlayerIsCaptain	= {this.props.handleClickPlayerIsCaptain}
			/>
		));

		return playersViewArray;
	}

	render() {
		return (
			<div className="eTeamWrapper_teamManagerWrapper">
				<div className="bTeam mDefaultView">
					<table className="table table-hover">
						{this.renderTableHead()}
						<tbody>
							{this.renderPlayers()}
						</tbody>
					</table>
				</div>
				<RemovePlayersButton
					isRemovePlayerButtonBlock={this.props.isRemovePlayerButtonBlock}
					handleClickRemovePlayerButton={() => this.props.handleClickRemovePlayerButton()}
				/>
			</div>
		);
	}
}