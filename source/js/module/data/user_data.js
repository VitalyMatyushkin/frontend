const	DataPrototype	= require('module/data/data_prototype'),
		Immutable		= require('immutable'),
		UserDataClass	= Object.create(DataPrototype),
		Helpers			= require('module/helpers/storage'),
		SessionHelper	= require('module/helpers/session_helper'),
		propz			= require('propz'),
		$				= require('jquery');

UserDataClass.sessionListener = undefined;

UserDataClass.getDefaultState = function () {
	let loginSession = Helpers.cookie.get('loginSession');
	let roleSession = Helpers.SessionStorage.get('roleSession');

	if(
		typeof loginSession === 'undefined' &&
		typeof roleSession !== 'undefined'
	) {
		roleSession = undefined;
		Helpers.SessionStorage.remove('roleSession');
	}

	if(!this.isValidSession(loginSession)) {
		loginSession = undefined;
		Helpers.cookie.remove('loginSession');
	}

	if(!this.isValidSession(roleSession)) {
		roleSession = undefined;
		Helpers.SessionStorage.remove('roleSession');
	}

	return {
		sessions: SessionHelper.createSessionsObject(
			loginSession,
			roleSession
		)
	};
};

UserDataClass.initBind = function () {
	const	self		= this,
			bindObject	= self.bindObject;

	self.setupAjax(
		SessionHelper.getActiveSessionBinding(bindObject)
	);
	bindObject.addListener('sessions', self.onChangeSessions.bind(self));
};

UserDataClass.onChangeSessions = function (eventDescriptor) {
	const	self		= this,
			bindObject	= self.bindObject;

	const	currentSessionsData		= eventDescriptor.getCurrentValue(),
			previousSessionsData	= eventDescriptor.getPreviousValue();

	switch (true) {
		// If login session was changed then we should:
		// 1) update login session in cookie
		// 2) remove role session in session storage
		// 3) remove role session in user data binding
		case !Immutable.is(
			currentSessionsData.get('loginSession'),
			previousSessionsData.get('loginSession')
		): {
			this.setLoginSessionToCookie();
			Helpers.SessionStorage.remove('roleSession');
			bindObject.withDisabledListener(
				this.sessionListener,
				() => SessionHelper.getRoleSessionBinding(bindObject).set(undefined)
			);
			break;
		}
		// If role session was changed then we should:
		// 1) update role session in session storage
		case !Immutable.is(
			currentSessionsData.get('roleSession'),
			previousSessionsData.get('roleSession')
		): {
			Helpers.SessionStorage.set('roleSession', SessionHelper.getRoleSession(bindObject));
			break;
		}
	}

	self.setupAjax(
		SessionHelper.getActiveSessionBinding(bindObject)
	);
};

UserDataClass.setLoginSessionToCookie = function () {
	const	self		= this,
			bindObject	= self.bindObject;

	if(bindObject.toJS('isRememberMe')) {
		Helpers.cookie.set(
			'loginSession',
			SessionHelper.getLoginSession(bindObject),
			{ expires : 365 } // one year cookie. just count of days because js-cookie convert days to msec itself
		);
	} else {
		Helpers.cookie.set('loginSession', SessionHelper.getLoginSession(bindObject));
	}
};

/**
 * Configuring ajax to perform all ajax requests from jquery with Authorization header
 * @param binding
 * @private
 */
UserDataClass.setupAjax = function (sessionBinding) {
	const session = sessionBinding.toJS();

	if(typeof session !== 'undefined') {
		const	usid	= session.adminId ? "asid" : "usid",
				options	= { headers:{} };
		options.headers[usid] = session.id;

		// A function to be called when the request finishes (after success and error callbacks are executed).
		// If status request is unauthorized, then remove session information.
		options.complete = jqXHR => {
			jqXHR.status === 401 && sessionBinding.clear();
		};

		$.ajaxSetup(options);
	} else {
		$.ajaxSetup({});
	}
};

UserDataClass.isValidSession = function (session) {
	const	id			= propz.get(session, ['id']),
			userId		= propz.get(session, ['userId']),
			expireAt	= propz.get(session, ['expireAt']);

	return (
		typeof id === 'string' &&
		typeof userId === 'string' &&
		typeof expireAt === 'string'
	);
};

module.exports = UserDataClass;