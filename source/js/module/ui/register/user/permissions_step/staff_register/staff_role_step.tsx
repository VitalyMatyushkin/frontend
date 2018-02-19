import * as React from 'react'

interface StaffRoleStepProps {
	defaultRole: string
	setRole: (type: string) => void
	handleClickBack: () => void
	schoolName: string
	availableRoles: AllowedPermission
}

interface StaffRoleStepState {
	selectedOption: string
}

interface AllowedPermission {
	ADMIN:		boolean
	MANAGER:	boolean
	TEACHER:	boolean
	COACH:		boolean
	STUDENT:	boolean
	PARENT:	boolean
}

export const STAFF_ROLES = {
	ADMIN:		{displayText:'I\'m a school administrator', value: 'ADMIN'},
	MANAGER:	{displayText:'I\'m a school manager', value: 'MANAGER'},
	TEACHER:	{displayText:'I\'m a school PE teacher', value: 'TEACHER'},
	COACH:		{displayText:'I\'m a coach', value: 'COACH'}
};

export class StaffRoleStep extends React.Component<StaffRoleStepProps, StaffRoleStepState> {
	constructor(props) {
		super(props);
		this.state = {
			selectedOption: this.props.defaultRole ? this.props.defaultRole : ''
		};
	}

	handleOptionChange(changeEvent): void {
		this.setState({
			selectedOption: changeEvent.target.value
		});
	}

	renderRolesOptions() {
		const options = [];
		for (const role in STAFF_ROLES) {
			if (this.props.availableRoles[STAFF_ROLES[role].value]) {  //if this role available in current school
				options.push(
					<div key={STAFF_ROLES[role].value}>
						<input
							type="radio"
							id={`radio_${STAFF_ROLES[role].value}`}
							value={STAFF_ROLES[role].value}
							checked={this.state.selectedOption === STAFF_ROLES[role].value}
							onChange={this.handleOptionChange.bind(this)}
						/>
						<label htmlFor={`radio_${STAFF_ROLES[role].value}`}>{STAFF_ROLES[role].displayText}</label>
					</div>
				)
			}
		}
		return <div className="bRegistrationOptions">{options}</div>;
	}

	render() {
		return (
			<div>
				<div className="bRegistrationTitlePermissionsStep">Choose your role with {this.props.schoolName}. Please select an option to continue:</div>
				<div className="bRegistrationMain">
					{this.renderRolesOptions()}
					<div className="bRegistrationControlButtons">
						<button className="bButton mCancel" onClick={() => this.props.handleClickBack()}>Back</button>
						<button className="bButton" onClick={() => this.props.setRole(this.state.selectedOption)}>Finish</button>
					</div>
				</div>
			</div>
		);
	}
}