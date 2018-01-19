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
			<div>
				<div className="bRegistrationTitleNew">Sign up for Squad In Touch</div>
				<div>
					<input
						type        = "radio"
						value       = {TYPE_USER.STAFF}
					    checked     = {this.state.selectedOption === TYPE_USER.STAFF}
					    onChange    = {this.handleOptionChange.bind(this)}
					/>
					I’m a member of a school staff
				</div>

				<div>
					<input
						type        = "radio"
						value       = {TYPE_USER.PARENT}
						checked     = {this.state.selectedOption === TYPE_USER.PARENT}
						onChange    = {this.handleOptionChange.bind(this)}
					/>
					I’m a parent of my sporty child (children)
				</div>

				<div>
					<input
						type        = "radio"
						value       = {TYPE_USER.STUDENT}
						checked     = {this.state.selectedOption === TYPE_USER.STUDENT}
						onChange    = {this.handleOptionChange.bind(this)}
					/>
					I’m a senior student and I’m keen sport
				</div>
				<button className="bButton" onClick={() => this.props.setRegisterType(this.state.selectedOption)}>Continue</button>
			</div>
		);
	}
}