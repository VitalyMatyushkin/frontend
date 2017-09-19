const	DataPrototype	= require('module/data/data_prototype'),
		Immutable		= require('immutable'),
		UserDataClass	= Object.create(DataPrototype),
		Helpers			= require('module/helpers/storage'),
		SessionHelper	= require('module/helpers/session_helper'),
		$				= require('jquery');

UserDataClass.sessionListener = undefined;

UserDataClass.getDefaultState = function () {
	const loginSession = Helpers.cookie.get('loginSession');
	let roleSession = Helpers.SessionStorage.get('roleSession');

	if(
		typeof loginSession === 'undefined' &&
		typeof roleSession !== 'undefined'
	) {
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
			Helpers.cookie.set('loginSession', SessionHelper.getLoginSession(bindObject));
			// TODO May be it should be a empty object
			Helpers.SessionStorage.set('roleSession', undefined);
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

module.exports = UserDataClass;