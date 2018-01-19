import * as React from 'react'
import 'styles/pages/register/b_register_test.scss';

interface SportsStarsTeamStepProps {
	setSportsStarsTeam: () => void
	handleClickBack: () => void
}

export class SportsStarsTeamStep extends React.Component<SportsStarsTeamStepProps, {}> {
	render() {
		return (
			<div>
				<div>Test</div>
				<button className="bButton mCancel" onClick={() => this.props.handleClickBack()}>Back</button>
				<button className="bButton" onClick={() => this.props.setSportsStarsTeam()}>Continue</button>
			</div>
		);
	}
}