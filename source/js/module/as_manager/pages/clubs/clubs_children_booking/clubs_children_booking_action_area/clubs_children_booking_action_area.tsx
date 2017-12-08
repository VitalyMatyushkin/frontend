import * as React from 'react';
import { Button } from "module/ui/button/button";

export interface ClubsChildrenBookingActionProps {
	handleSendMessages: () => any
}

export class ClubsChildrenBookingActionArea extends React.Component<ClubsChildrenBookingActionProps, {}> {

	render() {
		return (
			<div className = 'bClubsChildrenBookingActionsArea'>
				<Button
					text    = { 'Send messages' }
					onClick = { () => this.props.handleSendMessages() }
				/>
			</div>
		);
	}
}