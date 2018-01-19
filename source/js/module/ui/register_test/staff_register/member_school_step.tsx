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
	MONTH:  'MONTH',
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
			<div>
				<div>
					<input
						type        = "radio"
						value       = {SUBSCRIPTION_OPTIONS.FULL}
						checked     = {this.state.selectedOption === SUBSCRIPTION_OPTIONS.FULL}
						onChange    = {this.handleOptionChange.bind(this)}
					/>
						I'm  {this.props.schoolName} official and I would like to sign up my school for full subscription
				</div>

				<div>
					<input
						type        = "radio"
						value       = {SUBSCRIPTION_OPTIONS.MONTH}
						checked     = {this.state.selectedOption === SUBSCRIPTION_OPTIONS.MONTH}
						onChange    = {this.handleOptionChange.bind(this)}
					/>
						I'm {this.props.schoolName} official and I would like to sign up my school for 30 days trial subscription for free
				</div>

				<div>
					<input
						type        = "radio"
						value       = {SUBSCRIPTION_OPTIONS.FREE}
						checked     = {this.state.selectedOption === SUBSCRIPTION_OPTIONS.FREE}
						onChange    = {this.handleOptionChange.bind(this)}
					/>
						I'm PE teacher for {this.props.schoolName} and I would like to sign up with Squad In Touch as a sole PE teacher for free
				</div>

				<button className="bButton mCancel" onClick={() => this.props.handleClickBack()}>Back</button>
				<button className="bButton" onClick={() => this.props.setOptions(this.state.selectedOption)}>Continue</button>
			</div>
		);
	}
}
