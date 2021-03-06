import * as React from 'react'
import * as Morearty from 'morearty'
import * as Immutable from 'immutable'
import * as BPromise from 'bluebird'
import * as propz from 'propz'

import {AdminPermissionAcceptTooltip} from "module/as_admin/pages/admin_schools/admin_views/admin_permission_accept/admin_permission_accept_parent/admin_permission_accept_tooltip";

const stopWordsArray = [
	'Request',
	'to',
	'be',
	'parent',
	'of',
	'optional',
	'undefined'
];

const stopSymbolArray = [
	'\\(',
	'\\)',
	'\\[',
	'\\]',
	'"',
	'“',
	'”',
	'\''
];

export const AdminPermissionAcceptTooltipWrapper = (React as any).createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		permissionRequest: (React as any).PropTypes.object,
		handleClickStudent: (React as any).PropTypes.func
	},
	componentWillMount() {
		const binding = this.getDefaultBinding();
		const permissionRequest = this.props.permissionRequest;

		let students = [];
		binding.set('isSync', false);

		console.log(this.getPreparedComment());

		this.searchStudentsByComment(
			this.getPreparedComment()
		).then(_students => {
			students = _students.concat(students);

			if(students.length === 0) {
				return this.searchStudentsByLastNameAndGender(permissionRequest.requester.lastName);
			} else {
				return Promise.resolve([]);
			}
		})
		.then(_students => {
			students = _students.concat(students);
			const filteredStudents = this.filterSameIdStudents(students);
			const preparedStudents = this.getPreparedStudents(filteredStudents);

			binding.set('students', Immutable.fromJS(preparedStudents));
			binding.set('isSync', true);
		});
	},
	getRegexArray(): RegExp[] {
		return [
			// ex: Vincenzo Pollich
			/\s*([a-zA-Z]{2,})\s+([a-zA-Z]{2,})\s*/i,

			// ex: Request to be parent of [Isaac Rosenthal]
			/Request to be parent of \[\s*([a-zA-Z]{2,})\s+([a-zA-Z]{2,})\s*\]\s*/i,

			// ex: Request to be parent of [Optional("Adam Yeung")]
			/Request to be parent of \[\s*Optional\s*\(\s*"\s*([a-zA-Z]{2,})\s+([a-zA-Z]{2,})\s*"\)\s*\]\s*/i,

			// ex: Request to be parent of [ Optional(“Matthew Moore 9s”) ] Matthew Moors dad
			/Request to be parent of \[\s*Optional\s*\(\s*"\s*([a-zA-Z]{2,})\s+([a-zA-Z]{2,})\s+[a-zA-Z0-9]{2,}\s*"\)\s*\]\s*/i
		];
	},
	filterSameIdStudents(studentsArray) {
		const result = [];

		studentsArray.forEach(student => {
			if(result.findIndex(_student => _student.id === student.id) === -1) {
				result.push(Object.assign({}, student));
			}
		});

		return result;
	},
	getPreparedStudents(studentsArray) {
		return studentsArray.map(s => {
			const cpStudent = Object.assign({}, s);
			cpStudent.name = `${cpStudent.firstName} ${cpStudent.lastName}`;

			return cpStudent;
		});
	},
	getPreparedComment() {
		const permissionRequest = this.props.permissionRequest;
		let comment = propz.get(permissionRequest, ['requestedPermission', 'comment'], '');

		stopSymbolArray.forEach(stopSymbol => {
			const regexp = new RegExp(stopSymbol, 'ig');
			comment = comment.replace(regexp, '');
		});
		comment = comment.replace(/\s\s+/g, ' ');
		comment = comment.trim();

		return comment;
	},
	searchStudentsByComment(comment): BPromise<any[]> {
		let wordArray;

		if(typeof comment !== 'undefined') {
			wordArray = comment.split(' ');
			stopWordsArray.forEach(stopWord => {
				const indexWord = wordArray.indexOf(stopWord);
				if (indexWord !== -1) {
					wordArray.splice(indexWord, 1);
				}
			});
		}

		this.getDefaultBinding().set('studentFirstNameFromRequest', wordArray[0]);
		this.getDefaultBinding().set('studentLastNameFromRequest', wordArray[1]);

		const promise = this.searchStudentsByFirstNameAndLastNameAndGender(wordArray[0], wordArray[1]);

		return BPromise.resolve(promise).then(results => {
			let students = [];

			results.forEach(result => {
				students = students.concat(result);
			});

			return students;
		});
	},
	searchStudentsByFirstNameAndLastNameAndGender(firstName: string, lastName: string): BPromise<any[]> {
		const permissionRequest = this.props.permissionRequest;

		let students = [];
		const filter = {
			where: { firstName: firstName, lastName: lastName, gender: permissionRequest.requestedPermission.childGender }
		};

		return window.Server.schoolStudents.get(
			{ schoolId : permissionRequest.requestedPermission.schoolId },
			{ filter }
		).then(_students => {
			students = _students.concat(students);

			// and reverse
			filter.where.firstName = lastName;
			filter.where.lastName = firstName;
			return window.Server.schoolStudents.get(
				{ schoolId : permissionRequest.requestedPermission.schoolId },
				{ filter }
			);
		}).then(_students => {
			students = _students.concat(students);

			return BPromise.resolve(students);
		});
	},
	searchStudentsByLastNameAndGender(lastName: string): BPromise<any[]> {
		const permissionRequest = this.props.permissionRequest;

		const filter = {
			where: {
				lastName: lastName,
				gender: permissionRequest.requestedPermission.childGender
			}
		};

		return window.Server.schoolStudents.get(
			{ schoolId : permissionRequest.requestedPermission.schoolId },
			{ filter }
		);
	},
	handleClickStudent(studentId) {
		const binding = this.getDefaultBinding();
		const students = binding.toJS('students');
		const currentStudent = students.find(s => s.id === studentId);

		this.props.handleClickStudent(currentStudent);
	},
	render() {
		const binding = this.getDefaultBinding();
		const students = binding.toJS('students');
		const isSync = binding.toJS('isSync');

		if(isSync && students.length > 0) {
			return (
				<AdminPermissionAcceptTooltip
					students={students}
					handleClickStudent={(studentId) => this.handleClickStudent(studentId)}
				/>
			);
		} else {
			return null;
		}

	}
});