import * as React from 'react'
import * as propz from 'propz'

import 'styles/ui/admin_permission_accept_tooltip.scss'

export interface Student {
	id: string
	firstName: string
	lastName: string
	form?: {
		id: string
		name: string
	}
	house?: {
		id: string
		name: string
	}
}

export interface AdminPermissionAcceptTooltipProps {
	students: Student[]
	handleClickStudent: (studentId) => void
}

export class AdminPermissionAcceptTooltip extends React.Component<AdminPermissionAcceptTooltipProps, {}> {
	getStudentFormName(student: Student): string {
		return propz.get(student, ['form', 'name'], '');
	}

	getStudentHouseName(student: Student): string {
		return propz.get(student, ['house', 'name'], '');
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
				<h3 className='eAdminPermissionAcceptTooltip_header'>May be you need these students:</h3>
				{this.renderStudentList()}
			</div>
		);
	}
}