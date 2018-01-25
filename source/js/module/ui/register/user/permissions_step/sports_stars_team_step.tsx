import * as React from 'react';

interface SportsStarsTeamStepProps {
	setSportsStarsTeam: () => void
	handleClickBack: () => void
}

export class SportsStarsTeamStep extends React.Component<SportsStarsTeamStepProps, {}> {
	render() {
		return (
			<div className="bRegistrationMain">
				<div>Test</div>
				<div className="bRegistrationControlButtons">
					<button className="bButton mCancel" onClick={() => this.props.handleClickBack()}>Back</button>
					<button className="bButton" onClick={() => this.props.setSportsStarsTeam()}>Continue</button>
				</div>
			</div>
		);
	}
}