import * as React from 'react'

export interface AddPlayerTeamButtonProps {
	isAddTeamButtonBlocked: boolean,
	handleClickAddTeamButton: () => void
}

export class AddPlayerTeamButton extends React.Component<AddPlayerTeamButtonProps, {}> {
	handleClickAddTeamButton() {
		if(!this.props.isAddTeamButtonBlocked) {
			return this.props.handleClickAddTeamButton();
		}
	}

	render() {
		return (
			<div
				className="ePlayerChooser_addToTeamButton"
				id="addPlayer_button"
				onClick={() => this.handleClickAddTeamButton()}
			>
			</div>
		);
	}
};