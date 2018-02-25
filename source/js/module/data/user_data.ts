import {DataPrototype} from 'module/data/data_prototype';

const 	Immutable		= require('immutable'),
		Helpers			= require('module/helpers/storage'),
		SessionHelper	= require('module/helpers/session_helper'),
		propz			= require('propz'),
		BPromise 		= require('bluebird'),
		$				= require('jquery');

class UserDataClass extends DataPrototype {
	sessionListener: any = undefined;

	getDefaultState() {
		return {
			sessions: SessionHelper.createSessionsObject(
				Helpers.cookie.get('loginSession'),
				Helpers.SessionStorage.get('roleSession')
			)
		}
	}

	checkAndGetValidSessions() {
		let loginSession = Helpers.cookie.get('loginSession');
		let roleSession = Helpers.SessionStorage.get('roleSession');

		// role session can't exist without loginSession
		if(typeof loginSession === 'undefined' && typeof roleSession !== 'undefined') {
			roleSession = undefined;
			Helpers.SessionStorage.remove('roleSession');
		}

		let resultPromise = true;
		if(typeof loginSession !== 'undefined') {
			resultPromise = this.isValidSession(loginSession).then(data => {
				// if login session is valid - check role session
				if(data.isValidSession) {
					return this.isValidSession(roleSession).then(data => {
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

		return BPromise.resolve(resultPromise).then(() => {
			return {
				sessions: SessionHelper.createSessionsObject(
					loginSession,
					roleSession
				)
			};
		});
	}

	initBind() {
		const bindObject = this.bindObject;

		this.setupAjax(
			SessionHelper.getActiveSessionBinding(bindObject)
		);

		bindObject.addListener('sessions', this.onChangeSessions.bind(this));
	}

	onChangeSessions(eventDescriptor) {
		const bindObject	= this.bindObject;

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

		this.setupAjax(
			SessionHelper.getActiveSessionBinding(bindObject)
		);
	}

	setLoginSessionToCookie() {
		const bindObject	= this.bindObject;

		if(bindObject.toJS('isRememberMe')) {
			Helpers.cookie.set(
				'loginSession',
				SessionHelper.getLoginSession(bindObject),
				{ expires : 365 } // one year cookie. just count of days because js-cookie convert days to msec itself
			);
		} else {
			Helpers.cookie.set('loginSession', SessionHelper.getLoginSession(bindObject));
		}
	}

	/**
	 * Configuring ajax to perform all ajax requests from jquery with Authorization header
	 * @param binding
	 * @private
	 */
	setupAjax(sessionBinding): void {
		const session = sessionBinding.toJS();

		if(typeof session !== 'undefined') {
			const options = this.getOptions(session);

			/** setting global function which will be called when ajax meets 401 status code */
			(window as any).onDeAuth = function(status) {
				console.log('deAuthHandler. Status: ' + status);
				if(sessionBinding) sessionBinding.clear();
			};


			// I'll keep this code here for a while not to forget why this was done.

			// // A function to be called when the request finishes (after success and error callbacks are executed).
			// // If status request is unauthorized, then remove session information.
			// options.complete = jqXHR => {
			// 	jqXHR.status === 401 && sessionBinding.clear();
			// };
			//
			$.ajaxSetup(options);
		}
	}

	isValidSession(session) {
		let resultPromise;

		const resultObject = { isValidSession: false };

		const	id			= propz.get(session, ['id']),
				userId		= propz.get(session, ['userId']),
				expireAt	= propz.get(session, ['expireAt']);

		if(typeof id === 'string' && typeof userId === 'string' && typeof expireAt === 'string') {
			$.ajaxSetup(this.getOptions(session));
			resultPromise = (window.Server as any).profile
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

		return BPromise.resolve(resultPromise);
	}

	/**
	 * return jquery headers options
	 * @param session
	 */
	getOptions(session) {
		const sessionKeyName = session.adminId ? "asid" : "usid";

		return {
			headers: {
				[sessionKeyName]: session.id
			}
		};
	}

}

export const UserDataInstance = new UserDataClass();