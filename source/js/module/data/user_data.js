const	DataPrototype	= require('module/data/data_prototype'),
		Immutable		= require('immutable'),
		UserDataClass	= Object.create(DataPrototype),
		Helpers			= require('module/helpers/storage'),
		SessionHelper	= require('module/helpers/session_helper'),
		propz			= require('propz'),
		Promise 		= require('bluebird'),
		$				= require('jquery');

UserDataClass.sessionListener = undefined;

UserDataClass.getDefaultState = function () {
	return {
		sessions: SessionHelper.createSessionsObject(
			Helpers.cookie.get('loginSession'),
			Helpers.SessionStorage.get('roleSession')
		)
	}
};

UserDataClass.checkAndGetValidSessions = function () {
	let loginSession = Helpers.cookie.get('loginSession');
	let roleSession = Helpers.SessionStorage.get('roleSession');

	console.log(loginSession);
	console.log(roleSession);
	// role session can't exist without loginSession
	if(
		typeof loginSession === 'undefined' &&
		typeof roleSession !== 'undefined'
	) {
		roleSession = undefined;
		Helpers.SessionStorage.remove('roleSession');
	}

	let resultPromise = true;
	if(
		typeof loginSession !== 'undefined'
	) {
		resultPromise = this.isValidSession(loginSession)
			.then((data) => {
				// if login session is valid - check role session
				if(data.isValidSession) {
					return this.isValidSession(roleSession)
						.then((data) => {
							// if role session isn't valid - remove it
							if(!data.isValidSession) {
								roleSession = undefined;
								Helpers.SessionStorage.remove('roleSession');
							}

							return true;
						});
				} else {
					// if login session isn't valid - remove login and role sessions
					loginSession = undefined;
					Helpers.cookie.remove('loginSession');

					roleSession = undefined;
					Helpers.SessionStorage.remove('roleSession');

					return true;
				}
			});
	}

	return Promise.resolve(resultPromise)
		.then(() => {
			return {
				sessions: SessionHelper.createSessionsObject(
					loginSession,
					roleSession
				)
			};
		});
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
		const options = this.getOptions(session);

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
	let resultPromise;

	const resultObject = { isValidSession: false };

	const	id			= propz.get(session, ['id']),
			userId		= propz.get(session, ['userId']),
			expireAt	= propz.get(session, ['expireAt']);

	if(
		typeof id === 'string' &&
		typeof userId === 'string' &&
		typeof expireAt === 'string'
	) {
		$.ajaxSetup(
			this.getOptions(session)
		);
		resultPromise = window.Server.profile
			.get()
			.then(() => {
				$.ajaxSetup({});
				resultObject.isValidSession = true;
				return resultObject;
			})
			.catch(() => {
				$.ajaxSetup({});
				return { isValidSession: false };
			});
	} else {
		resultPromise = Promise.resolve(resultObject);
	}

	return Promise.resolve(resultPromise);
};

UserDataClass.getOptions = function (session) {
	const usid = session.adminId ? "asid" : "usid";

	const options = { headers:{} };

	options.headers[usid] = session.id;

	return options;
};

module.exports = UserDataClass;