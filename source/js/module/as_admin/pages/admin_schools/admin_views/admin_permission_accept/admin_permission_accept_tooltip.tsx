import * as React from 'react'
import * as propz from 'propz'

import 'styles/ui/admin_permission_accept_tooltip.scss'

export interface AdminPermissionAcceptTooltipProps {
	students: any[]
	handleClickStudent: (studentId) => void
}

export class AdminPermissionAcceptTooltip extends React.Component<AdminPermissionAcceptTooltipProps, {}> {
	getStudentFormName(student) {
		const formName = propz.get(student, ['form', 'name'], undefined);

		return typeof formName !== 'undefined' ? formName : '';
	}

	getStudentHouseName(student) {
		const houseName = propz.get(student, ['house', 'name'], undefined);

		return typeof houseName !== 'undefined' ? houseName : '';
	}

	renderStudentList() {
		const students = this.props.students.map((student, index) => {
			return (
				<div
					className='eAdminPermissionAcceptTooltip_student'
					key={student.id + index}
					onClick={() => this.props.handleClickStudent(student.id)}
				>
					{student.firstName} {student.lastName} {this.getStudentFormName(student)} {this.getStudentHouseName(student)}
				</div>
			);
		});

		return (
			<div className='eAdminPermissionAcceptTooltip_studentList'>
				{students}
			</div>
		)
	}

	render() {
		return (
			<div className='bAdminPermissionAcceptTooltip'>
				<h3>May be you need these students:</h3>
				{this.renderStudentList()}
			</div>
		);
	}
}