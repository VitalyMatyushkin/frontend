import * as React from 'react';

interface TermsAndConditionsStepProps {
	handleTermsAndConditions: () => void
	handleClickBack: () => void
}

export class TermsAndConditionsStep extends React.Component<TermsAndConditionsStepProps, {}> {
	render() {
		return (
			<div className="bRegistrationMain">
				<div>Agree with Terms adn Conditions adjusted</div>
				<div className="bRegistrationControlButtons">
					<button className="bButton mCancel" onClick={() => this.props.handleClickBack()}>Back</button>
					<button className="bButton" onClick={() => this.props.handleTermsAndConditions()}>Continue</button>
				</div>
			</div>
		);
	}
}