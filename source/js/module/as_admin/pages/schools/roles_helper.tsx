export class RolesHelper {
	static getRoles () {
		return [
			{id:'ADMIN', value: 'Admin'},
			{id:'MANAGER', value: 'Manager'},
			{id:'STUDENT', value: 'Student'},
			{id:'COACH', value: 'Coach'},
			{id:'PARENT', value: 'Parent'},
			{id:'TEACHER', value: 'Teacher'}
		];
	}

	static convertRolesFromServerToClient (roles) {
		const allRoles = this.getRoles();

		let clientRoles = [];

		for (let role in roles) {
			const clientRole = allRoles.find(_r => _r.id === role);
			if(typeof clientRole !== 'undefined' && roles[role]) {
				clientRoles.push(clientRole);
			}
		}

		return clientRoles;
	}

	static convertRolesFromClientToServer (roles) {
		const result = {
			ADMIN: false,
			MANAGER: false,
			STUDENT: false,
			COACH: false,
			PARENT: false,
			TEACHER: false
		};
		roles.forEach(r => {
			result[r.id] = true;
		});

		return result;
	}

	static getAvailableRolesForSchoolBySolePETeacher () {
		return {ADMIN: false, MANAGER: false, STUDENT: true, COACH: false, PARENT: true, TEACHER: false}
	}

	static getAvailableRolesForSchoolByAdmin () {
		return {ADMIN: true, MANAGER: true, STUDENT: true, COACH: true, PARENT: true, TEACHER: true}
	}
}