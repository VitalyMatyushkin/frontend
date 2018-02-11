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
	FULL:	'FULL',
	TRIAL:	'TRIAL',
	FREE:	'FREE'
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
	    const   {schoolName}        = this.props,
                {selectedOption}    = this.state;

		return (
			<div>
				<div className="bRegistrationTitlePermissionsStep">You appear to be the first member of staff for {schoolName} to have signed up to Squad In Touch. Please select an option to continue.</div>
				<div className="bRegistrationMain">
					<div className="bRegistrationOptions">
						<div>
							<input
								type		= "radio"
								id			= {`radio_${SUBSCRIPTION_OPTIONS.FULL}`}
								value		= {SUBSCRIPTION_OPTIONS.FULL}
								checked		= {selectedOption === SUBSCRIPTION_OPTIONS.FULL}
								onChange	= {this.handleOptionChange.bind(this)}
							/>
							<label htmlFor={`radio_${SUBSCRIPTION_OPTIONS.FULL}`}>I’m a school official for {schoolName} and I would like to sign my school up to the full subscription</label>
						</div>

						<div>
							<input
								type		= "radio"
								id			= {`radio_${SUBSCRIPTION_OPTIONS.TRIAL}`}
								value		= {SUBSCRIPTION_OPTIONS.TRIAL}
								checked		= {selectedOption === SUBSCRIPTION_OPTIONS.TRIAL}
								onChange	= {this.handleOptionChange.bind(this)}
							/>
							<label htmlFor={`radio_${SUBSCRIPTION_OPTIONS.TRIAL}`}>I’m a school official for {schoolName} and I would like to sign up for the 30 days free trial
                            </label>
						</div>

						<div>
							<input
								type		= "radio"
								id			= {`radio_${SUBSCRIPTION_OPTIONS.FREE}`}
								value		= {SUBSCRIPTION_OPTIONS.FREE}
								checked		= {selectedOption === SUBSCRIPTION_OPTIONS.FREE}
								onChange	= {this.handleOptionChange.bind(this)}
							/>
							<label htmlFor={`radio_${SUBSCRIPTION_OPTIONS.FREE}`}>I’m a PE teacher for {schoolName} and I would like to sign up as a sole PE teacher for free
                            </label>
						</div>
					</div>
					<div className="bRegistrationControlButtons">
						<button className="bButton mCancel" onClick={() => this.props.handleClickBack()}>Back</button>
						<button className="bButton" onClick={() => this.props.setOptions(this.state.selectedOption)}>Continue</button>
					</div>
				</div>
			</div>
		);
	}
}
