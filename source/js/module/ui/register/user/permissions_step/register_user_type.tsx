import * as React from 'react'

interface RegisterUserTypeProps {
	setRegisterType: (type: string) => void
}

interface RegisterUserTypeState {
	selectedOption: string
}

export const TYPE_USER = {
	STAFF: 'STAFF',
	PARENT: 'PARENT',
	STUDENT: 'STUDENT',
};

export class RegisterUserType extends React.Component<RegisterUserTypeProps, RegisterUserTypeState> {
	constructor(props) {
		super(props);
		this.state = {
			selectedOption: ''
		};
	}

	handleOptionChange(changeEvent): void {
		this.setState({
			selectedOption: changeEvent.target.value
		});
	}

	render() {
		return (
			<div className="bRegistrationPermissionsStep">
				<div className="bRegistrationTitlePermissionsStep">Please, select the type of user</div>
				<div className="bRegistrationMain">
					<div className="bRegistrationOptions">
						<div>
							<input
								type        = "radio"
								className   = "radio"
								id          = {`radio_${TYPE_USER.STAFF}`}
								value       = {TYPE_USER.STAFF}
							    checked     = {this.state.selectedOption === TYPE_USER.STAFF}
							    onChange    = {this.handleOptionChange.bind(this)}
							/>
							<label htmlFor={`radio_${TYPE_USER.STAFF}`}>I’m a member of staff within my school</label>
						</div>

						<div>
							<input
								type        = "radio"
								className   = "radio"
								id          = {`radio_${TYPE_USER.PARENT}`}
								value       = {TYPE_USER.PARENT}
								checked     = {this.state.selectedOption === TYPE_USER.PARENT}
								onChange    = {this.handleOptionChange.bind(this)}
							/>
							<label htmlFor={`radio_${TYPE_USER.PARENT}`}>I’m a parent to my sporty child / children</label>
						</div>

						<div>
							<input
								type        = "radio"
								className   = "radio"
								id          = {`radio_${TYPE_USER.STUDENT}`}
								value       = {TYPE_USER.STUDENT}
								checked     = {this.state.selectedOption === TYPE_USER.STUDENT}
								onChange    = {this.handleOptionChange.bind(this)}
							/>
							<label htmlFor={`radio_${TYPE_USER.STUDENT}`}>I’m a senior student and I’m a keen sports player</label>
						</div>
					</div>
					<div className="bRegistrationControlButtons">
						<button className="bButton" onClick={() => this.props.setRegisterType(this.state.selectedOption)}>Continue</button>
					</div>
				</div>
			</div>
		);
	}
}