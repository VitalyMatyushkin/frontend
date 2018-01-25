import * as React from 'react'

interface RegisterTypeStepProps {
	defaultType: string
	setRegisterType: (type: string) => void
	handleClickBack: () => void
	mode: string
}

interface RegisterTypeStepState {
	selectedOption: string
}

export const TYPE_REGISTER = {
	SCHOOL: {
		type: 'SCHOOL',
		studentText: 'My school invited me to sign up with Squad In Touch',
		parentText: 'My child’s school invited me to sign up with Squad In Touch'
	},
	INDIVIDUAL: {
		type: 'INDIVIDUAL',
		studentText: 'I would like to sign up as an individual student to be a member of Squad In Touch Sports Stars Team',
		parentText: 'I would like to sign up as an individual parent\tto get in touch with Squad In Touch Sports Stars Team'
	}
};

export class RegisterTypeStep extends React.Component<RegisterTypeStepProps, RegisterTypeStepState> {
	constructor(props) {
		super(props);
		this.state = {
			selectedOption: this.props.defaultType ? this.props.defaultType : ''
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
							id          = {`radio_${TYPE_REGISTER.SCHOOL.type}`}
							value       = {TYPE_REGISTER.SCHOOL.type}
							checked     = {this.state.selectedOption === TYPE_REGISTER.SCHOOL.type}
							onChange    = {this.handleOptionChange.bind(this)}
						/>
						<label htmlFor={`radio_${TYPE_REGISTER.SCHOOL.type}`}>{this.props.mode === 'student' ? TYPE_REGISTER.SCHOOL.studentText : TYPE_REGISTER.SCHOOL.parentText}</label>
					</div>

					<div>
						<input
							type        = "radio"
							id          = {`radio_${TYPE_REGISTER.INDIVIDUAL.type}`}
							value       = {TYPE_REGISTER.INDIVIDUAL.type}
							checked     = {this.state.selectedOption === TYPE_REGISTER.INDIVIDUAL.type}
							onChange    = {this.handleOptionChange.bind(this)}
						/>
						<label htmlFor={`radio_${TYPE_REGISTER.INDIVIDUAL.type}`}>{this.props.mode === 'student' ? TYPE_REGISTER.INDIVIDUAL.studentText : TYPE_REGISTER.INDIVIDUAL.parentText}</label>

					</div>
				</div>
				<div className="bRegistrationControlButtons">
					<button className="bButton mCancel" onClick={() => this.props.handleClickBack()}>Back</button>
					<button className="bButton" onClick={() => this.props.setRegisterType(this.state.selectedOption)}>Next</button>
				</div>
			</div>
		);
	}
}