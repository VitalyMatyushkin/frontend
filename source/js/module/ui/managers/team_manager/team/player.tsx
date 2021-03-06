import * as React from 'react';
import {PlayerPositionsColumn, Position} from './playerPositionsColumn';
import {PlayerSubColumn} from './playerSubColumn';
import {PlayerIsCaptainColumn} from './playerIsCaptainColumn';
import * as classNames from 'classnames';
import {ClubsChildrenBookingHelper} from "module/as_manager/pages/clubs/clubs_children_booking/clubs_children_booking_helper/clubs_children_booking_helper";

export interface PlayerStruct {
    id:             string
    positionId:     string
    isCaptain:      boolean
    sub:            boolean
    firstName:      string
    lastName:       string
	messageStatus?: string
	parents?:       any[]
    form?:          {
                        name:   string
                    }
}

export interface PlayerProps {
	// TODO it's wrong way. we need a new type for team component. but time is a money.
	isClubPage?:                 boolean
    isNonTeamSport:				boolean
    number:						number
    player:						PlayerStruct
    positions:					Position[]
    handleClickPlayer:			(playerId: string) => void
    handleChangePlayerPosition:	(playerId: string, newPositionId: string) => void
    handleClickPlayerSub:		(playerId: string, isSub: boolean) => void
    handleClickPlayerIsCaptain:	(playerId: string, isCaptain: boolean) => void
}

export interface PlayerState {
    isSelected: boolean
}

export class Player extends React.Component<PlayerProps, PlayerState> {
    constructor(props: PlayerProps) {
        super(props);
        this.state = { isSelected: false };
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

    handlePlayerClick() {
        this.setState({
            isSelected: !this.state.isSelected
        });
        this.props.handleClickPlayer(this.props.player.id);
    }

    handleChangePlayerPosition(newPositionId: string) {
        this.props.handleChangePlayerPosition(this.props.player.id, newPositionId);
    }

    handleClickPlayerSub(isSub: boolean) {
        this.props.handleClickPlayerSub(this.props.player.id, isSub);
    }

    handleClickPlayerIsCaptain(isCaptain: boolean) {
        this.props.handleClickPlayerIsCaptain(this.props.player.id, isCaptain);
    }

	renderInvitationStatus() {
        if(typeof this.props.isClubPage === 'boolean' && this.props.isClubPage) {
	        return (
		        <td className="col-md-4">
			        {this.getMessageStatus()}
		        </td>
	        );
        } else {
            return null;
        }
    }

    renderPositions() {
        if(this.props.isNonTeamSport) {
            return null;
        } else {
            return (
                <PlayerPositionsColumn
	                positions					= {this.props.positions}
                    selectedPositionId			= {this.props.player.positionId}
                    handleChangePlayerPosition	= {newPositionId => this.handleChangePlayerPosition(newPositionId)}
                />
            );
        }
    }

    renderIsCaptain() {
        if(this.props.isNonTeamSport) {
            return null;
        } else {
            return (
                <PlayerIsCaptainColumn
                    isChecked={this.props.player.isCaptain}
                    handleClickPlayerIsCaptain={isCaptain => this.handleClickPlayerIsCaptain(isCaptain)}
                />
            );
        }
    }

    renderSub() {
        if(this.props.isNonTeamSport) {
            return null;
        } else {
            return (
                <PlayerSubColumn	isChecked				= {this.props.player.sub}
                                    handleClickPlayerSub	= {isSub => this.handleClickPlayerSub(isSub)}
                />
            );
        }
    }

    render() {
        const {player} = this.props;

        const	playerClass	= classNames({
                eTeam_player:	true,
                mSelected:		this.state.isSelected
            }),
            playerNameClass = classNames({
                'col-md-3': !this.props.isNonTeamSport,
                'col-md-8': this.props.isNonTeamSport
            }),
            playerFormClass = classNames({
                'col-md-1': !this.props.isNonTeamSport,
                'col-md-4': this.props.isNonTeamSport
            });

        return (
            <tr
                className	= { playerClass }
                onClick		= { () => this.handlePlayerClick() }
            >
                <th scope="row">
                    { this.props.number }
                </th>
                <td className = { playerNameClass } >
                    {`${player.firstName} ${player.lastName}`}
                </td>
                <td className = { playerFormClass } >
                    { player.form ? player.form.name : ""}
                </td>
	            { this.renderInvitationStatus() }
                { this.renderPositions() }
                { this.renderIsCaptain() }
                { this.renderSub() }
            </tr>
        );
    }
}