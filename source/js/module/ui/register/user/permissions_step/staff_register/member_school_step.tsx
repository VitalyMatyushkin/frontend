import * as React from 'react'

interface  MemberSchoolStepProps {
	setOptions: (type: string) => void
	defaultOption: string
	handleClickBack: () => void
	schoolName: string
}

interface  MemberSchoolStepState {
	selectedOption: string
}

export const SUBSCRIPTION_OPTIONS = {
	FULL:   'FULL',
	TRIAL:  'TRIAL',
	FREE:   'FREE'
};

export class MemberSchoolStep extends React.Component< MemberSchoolStepProps,  MemberSchoolStepState> {
	constructor(props) {
		super(props);
		this.state = {
			selectedOption: this.props.defaultOption ? this.props.defaultOption : ''
		};
	}

	handleOptionChange(changeEvent): void {
		this.setState({
			selectedOption: changeEvent.target.value
		});
	}

	render() {
		return (
			<div className="bRegistrationMain">
				<div className="bRegistrationOptions">
					<div>
						<input
							type        = "radio"
							id          = {`radio_${SUBSCRIPTION_OPTIONS.FULL}`}
							value       = {SUBSCRIPTION_OPTIONS.FULL}
							checked     = {this.state.selectedOption === SUBSCRIPTION_OPTIONS.FULL}
							onChange    = {this.handleOptionChange.bind(this)}
						/>
						<label htmlFor={`radio_${SUBSCRIPTION_OPTIONS.FULL}`}>I'm  {this.props.schoolName} official and I would like to sign up my school for full subscription</label>
					</div>

					<div>
						<input
							type        = "radio"
							id          = {`radio_${SUBSCRIPTION_OPTIONS.TRIAL}`}
							value       = {SUBSCRIPTION_OPTIONS.TRIAL}
							checked     = {this.state.selectedOption === SUBSCRIPTION_OPTIONS.TRIAL}
							onChange    = {this.handleOptionChange.bind(this)}
						/>
						<label htmlFor={`radio_${SUBSCRIPTION_OPTIONS.TRIAL}`}>I'm {this.props.schoolName} official and I would like to sign up my school for 30 days trial subscription for free</label>
					</div>

					<div>
						<input
							type        = "radio"
							id          = {`radio_${SUBSCRIPTION_OPTIONS.FREE}`}
							value       = {SUBSCRIPTION_OPTIONS.FREE}
							checked     = {this.state.selectedOption === SUBSCRIPTION_OPTIONS.FREE}
							onChange    = {this.handleOptionChange.bind(this)}
						/>
						<label htmlFor={`radio_${SUBSCRIPTION_OPTIONS.FREE}`}>I'm PE teacher for {this.props.schoolName} and I would like to sign up with Squad In Touch as a sole PE teacher for free</label>
					</div>
				</div>
				<div className="bRegistrationControlButtons">
					<button className="bButton mCancel" onClick={() => this.props.handleClickBack()}>Back</button>
					<button className="bButton" onClick={() => this.props.setOptions(this.state.selectedOption)}>Continue</button>
				</div>
			</div>
		);
	}
}
