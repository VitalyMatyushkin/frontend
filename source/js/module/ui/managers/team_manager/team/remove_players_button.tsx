import * as React from 'react';

export interface RemovePlayersButtonProps {
    // if true - remove player button doesn't response to user click
    isRemovePlayerButtonBlock:		boolean
    // handler function for onClick event
    handleClickRemovePlayerButton:	() => void
}

export class RemovePlayersButton extends React.Component<RemovePlayersButtonProps, {}> {
    handleClickRemovePlayerButton() {
        if(!this.props.isRemovePlayerButtonBlock) {
            this.props.handleClickRemovePlayerButton();
        }
    }

    render() {
        return (
            <div	className	= "eTeam_removeButton"
                    id  		= "removePlayer_button"
                    onClick		= { () => this.handleClickRemovePlayerButton() }
            />
        );
    }
}
