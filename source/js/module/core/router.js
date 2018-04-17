const	Immutable 		= require('immutable'),
		React 			= require('react'),
		Router			= require('director'),
		Bowser 			= require('bowser'),
		SessionHelper	= require('module/helpers/session_helper'),
		Helpers			= require('module/helpers/storage'),
		propz			= require('propz'),
		Morearty		= require('morearty');

const RouterView = React.createClass({
	mixins: [Morearty.Mixin],
	isAuthorized: 	false,
	isVerified: 	false,

	/**
	 * Connects this component to global state's authorization info.
	 * Effectively it will set this.isAuthorized and this.isVerified properties on this and
	 * do something strange with routing in case if user is authorized
	 */
	bindToAuthorization: function() {
		const	self		= this,
				authBinding	= SessionHelper.getRoleSessionBinding(
					self.getDefaultBinding().sub('userData')
				);

		function updateAuth() {
			const data = authBinding.toJS();

			// TODO: make check a bit easier. Add policy/rules check?
			if (data && data.id && data.verified) {		// if there is id and user is verified, consider user as authorized
				self.isAuthorized = true;				// and setting flag about that.

				// Redirecting to verification page
				if (!data.verified.email ||  !data.verified.phone) {	// if user don't have email or phone verified...
					self.isVerified = false;							// setting flag about that (should take use somewhere??)
				} else {
					self.isVerified = true;								// yes, user is both authorized and verified
					// in case of redirection resumption user will be redirected to expected page
					// TODO: does it really work????????????
					self.nextRoute && self.setRoute(self.nextRoute);	// then going to some route..
					self.nextRoute = false;								// and then setting it to FALSE ?????
				}
			} else {													// if user not authorized..
				self.isAuthorized = false;								// rising couple of flags, okay
				self.isVerified = false;
			}
		}

		authBinding.addListener(updateAuth);	// subscribing on all auth info updates
		updateAuth();							// and forcing first update
	},

	/**
	 * @typedef {Object} NormalizedRoute
	 * @param {String} path
	 * @param {String} component
	 * TODO: finish me.
	 * TODO: maybe it should be real class ?
	 */

	/**
	 * Build normalized routing data from provided routing component and return array of normalize routes.
	 * What is 'normalized'? Each {@see Route} have path property which effectively can contain space separated
	 * paths. Normalized route is route where each path property contain only one path.
	 *
	 * It also can set some default properties if they was not provided by
	 * @param {Route} routeComponent
	 * @returns {Array.<NormalizeRoute>}
	 * @private
	 */
	normalizeRouteComponent: function(routeComponent) {
		const 	self 			= this,
				binding 		= self.getDefaultBinding(),
				routePathList 	= routeComponent.props.path.split(' ');	// path can be space separated string of paths

		const routes = routePathList.map( currentRoute => {
			const routeData = {
				path: 				currentRoute,
				component: 			routeComponent.props.component,
				pageName: 			routeComponent.props.pageName || '',
				binding: 			routeComponent.props.binding || binding,
				unauthorizedAccess: routeComponent.props.unauthorizedAccess ? routeComponent.props.unauthorizedAccess : false,
				routeComponent: 	routeComponent
			};
			return routeData;
		});

		// TODO: this is straaaange, bro
		if(routeComponent.props.loginRoute) {	// if this is login route, storing it in special property TODO: why????
			self.loginRoute = routes[0];		// this was part of original code. I'm not sure if this should work this way, so just refactored a bit
		}

		if (routeComponent.props.verifyRoute) {	// if this is verify route, storing it in special property TODO: why ?
			self.verifyRoute = routes[0];		// this was part of original code. I'm not sure if this should work this way, so just refactored a bit
		}

		return routes;
	},
	/**
	 * Extracts routing information from child routes. @see Route
	 *
	 * Will traverse all routes (with all nested sub-routes), normalize each route and return array of all normalized routes.
	 * @param childRouteOrRoutes {Array.<Route> | Route } it is usually taken from `this.props.children` which can be both Array of Routes and
	 * the only Route without array wrapper in case of one route
	 * @returns {Array.<NormalizedRoute>}
	 */
	normalizeAllRoutes: function(childRouteOrRoutes) {
		const 	self 		= this,
				routeArray 	= Array.isArray(childRouteOrRoutes) ? childRouteOrRoutes : [childRouteOrRoutes];	// casting all to array. This is not very efficent, but still works.
		let 	routes 	= [];

		routeArray.forEach( route => {
			if (route.props.children) {	// Processing nested routes
				routes = routes.concat(self.normalizeAllRoutes(route.props.children));
			} else {
				routes = routes.concat(self.normalizeRouteComponent(route));
			}

		});

		return routes;
	},
	/**
	 * Setting route to be active
	 */
	setRoute: function(route) {
		const 	self 		= this,
				component 	= route.component;

		self.siteComponents[route.path] = {
			View: 				component,
			routeComponent: 	route.routeComponent,
			binding: 			route.binding
		};

		self.currentPath = route.path;
		self.RoutingBinding.atomically()
			.set('currentPath', self.currentPath)
			.set('currentPathParts', self.currentPath.split('/').filter(Boolean))
			.set('currentPageName', route.pageName)
			.commit();

		self.isMounted() && self.forceUpdate();

	},
	/**
	 * Adding new route
	 * @param {NormalizedRoute} route
	 */
	addRoute: function(route) {
		const self = this;

		// setting handler function to this route
		// handler function will be called with some arguments...
		self.siteRoutes[route.path] = function(){
			const pathParameters = Array.prototype.slice.call(arguments, 0);	// turning function arguments to array

			// Updating parametrized parts of path
			// TODO: What the fucking fuck is RoutingBinding ???
			self.RoutingBinding.set('pathParameters', Immutable.fromJS(pathParameters));//set and remove parameters

			// User will be redirected to login page when unauthorized.
			// In this case latest routing is saved(which is really current route)

			switch (true) {
				case route.unauthorizedAccess === true:	// if this route not require auth - just switching
					self.setRoute(route);
					break;
				case self.isAuthorized === false && self.loginRoute:	// if user not authorized (picked from binding) and there is login route...
					self.setRoute(self.loginRoute);						// then going to login route.
					//if latest routing(which is really current route) is a login, then don't save it
					if(self.loginRoute.path !== route.path)
						self.nextRoute = route;
					break;
				case self.isVerified === false && self.verifyRoute:
					self.setRoute(self.verifyRoute);
					self.nextRoute = route;
					break;
				default:
					self.setRoute(route);
			}
		}
	},
	updateUrlParametrs: function() {

		let urlHash = document.location.hash;

		const 	self 				= this,
				parametersIndex 	= urlHash.indexOf('?'),
				parametersResult 	= {};


		if (parametersIndex !== -1) {
			urlHash = urlHash.substr(parametersIndex + 1);
			urlHash.split('&').forEach(function(oneParameter) {
				const parametrSplit = oneParameter.split('=');

				parametersResult[parametrSplit[0]] = decodeURIComponent(parametrSplit[1]);
			});
		}

		self.RoutingBinding.set('parameters', Immutable.fromJS(parametersResult));

	},
	isLoginSessionValid: function () {
		const loginSessionFromCookie = Helpers.cookie.get('loginSession');
		const loginSessionFromBinding = SessionHelper.getLoginSession(
			this.getDefaultBinding().sub('userData')
		);

		// Valid when login session in binding is equal login session in cookie
		return propz.get(loginSessionFromCookie, ['id']) === propz.get(loginSessionFromBinding, ['id']);
	},
	isBlogUrl: function() {
		return document.location.hostname.search('blog') !== -1;
	},
	componentWillMount: function() {
		const	self	= this,
				routes	= self.normalizeAllRoutes(self.props.children);

		self.isAuthorized 		= false;
		self.RoutingBinding 	= self.props.routes;
		self.currentPath 		= undefined;

		self.siteRoutes = {};
		self.siteComponents = {};

		// Building routing table. .addRoute will fill .siteRoutes with path -> handler pairs
		routes && routes.forEach( route => self.addRoute(route) );

		/**
		 * Handling address(url) change
		 * IE & Edge do not fire the popstate event when the URL's hash value changes
		 * */
		if(Bowser.msie ||Bowser.msedge){
			window.addEventListener('hashchange', self.updateUrlParametrs);	// for Edge and IE
		}
		else{
			window.addEventListener('popstate', self.updateUrlParametrs);	// other browsers
		}

		// Binding authorization info
		self.bindToAuthorization();

		// router init
		self.updateUrlParametrs();


		self.routerInstance = Router.Router(self.siteRoutes);
		self.routerInstance.init();

	},
	render: function() {
		const	self			= this,
				currentPath		= self.currentPath,
				siteComponent	= self.siteComponents[currentPath];

		// Dirty ad-hoc solution. Router update required (wrote by somebody, I don't understand really)
		if (
			document.location.href.indexOf('#') === -1 ||
			document.location.hash === ''
		) {
			switch (true) {
				case this.isBlogUrl(): {
					document.location = '#feed';
					break;
				}
				default: {
					document.location = '#login';
					break;
				}
			}
		}

		if(!this.isLoginSessionValid()) {
			window.location.reload();
		}

		return siteComponent ? React.createElement(siteComponent.View, siteComponent.routeComponent.props) : null;
	}
});

module.exports = RouterView;

