import * as React from 'react'
import 'styles/pages/register/b_register_test.scss';

interface TermsAndConditionsStepProps {
	handleTermsAndConditions: () => void
	handleClickBack: () => void
}

export class TermsAndConditionsStep extends React.Component<TermsAndConditionsStepProps, {}> {
	render() {
		return (
			<div>
				<div>Agree with Terms adn Conditions adjusted</div>
				<button className="bButton mCancel" onClick={() => this.props.handleClickBack()}>Back</button>
				<button className="bButton" onClick={() => this.props.handleTermsAndConditions()}>Continue</button>
			</div>
		);
	}
}