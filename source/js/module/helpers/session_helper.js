const propz = require('propz');

const SessionHelper = {
	getActiveSessionName: function(userDataBinding) {
		let activeSessionName;
	
		if(typeof userDataBinding.toJS('sessions.roleSession') !== 'undefined') {
			activeSessionName = 'roleSession';
		} else {
			activeSessionName = 'loginSession';
		}
	
		return activeSessionName;
	},
	getActiveSession: function(userDataBinding) {
		return this.getActiveSessionBinding(userDataBinding).toJS();
	},
	getActiveSessionBinding: function(userDataBinding) {
		return userDataBinding.sub(
			`sessions.${this.getActiveSessionName(userDataBinding)}`
		);
	},
	getLoginSessionBinding: function(userDataBinding) {
		return userDataBinding.sub('sessions.loginSession');
	},
	getLoginSession: function(userDataBinding) {
		return userDataBinding.toJS('sessions.loginSession');
	},
	getRoleSessionBinding: function(userDataBinding) {
		return userDataBinding.sub('sessions.roleSession');
	},
	getRoleSession: function(userDataBinding) {
		return userDataBinding.toJS('sessions.roleSession');
	},
	getRoleFromSession: function (userDataBinding) {
		const activeSessionBinding = this.getActiveSessionBinding(userDataBinding);

		let role;
		if(typeof activeSessionBinding !== 'undefined') {
			role = propz.get(
				activeSessionBinding.toJS(),
				['role']
			);
		}

		return role;
	},
	getUserIdFromSession: function (userDataBinding) {
		const activeSessionBinding = this.getActiveSessionBinding(userDataBinding);

		let userId;
		if(typeof activeSessionBinding !== 'undefined') {
			userId = propz.get(
				activeSessionBinding.toJS(),
				['userId']
			);
		}

		return userId;
	},
	getSessionId: function (userDataBinding) {
		const activeSessionBinding = this.getActiveSessionBinding(userDataBinding);

		let id;
		if(typeof activeSessionBinding !== 'undefined') {
			id = propz.get(
				activeSessionBinding.toJS(),
				['id']
			);
		}

		return id;
	},
	getSessionsData: function (userDataBinding) {
		return userDataBinding.toJS('sessions');
	},
	getSessionsDataBinding: function (userDataBinding) {
		return userDataBinding.sub('sessions');
	},
	createSessionsObject: function (loginSession, roleSession) {
		return {
			loginSession:	loginSession,
			roleSession:	roleSession
		};
	}
};

module.exports = SessionHelper;