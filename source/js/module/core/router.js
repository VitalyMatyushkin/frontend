const 	Immutable 	= require('immutable'),
		React 		= require('react'),
		Router		= require('director'),
		Morearty	= require('morearty');

const RouterView = React.createClass({
	mixins: [Morearty.Mixin],
	isAuthorized: false,
	isVerified: false,
	bindToAuthorization: function() {
		const 	self 		= this,
				authBinding = self.getDefaultBinding().sub('userData.authorizationInfo');

		function updateAuth() {
			var data = authBinding.toJS();

			// TODO: make check a bit easier. Add policy/rules check?
			if (data && data.id && data.verified) {		// if there is id and user is verified, consider user as authorized
				self.isAuthorized = true;				// and setting flag about that.

				// Redirecting to verification page
				if (!data.verified.email ||  !data.verified.phone) {	// if user don't have email or phone verified...
					self.isVerified = false;							// setting flat about that
				} else {
					self.isVerified = true;
					// in case of redirection resumption user will be redirected to expected page
					// TODO: does it really work????????????
					self.nextRoute && self.setRoute(self.nextRoute);
					self.nextRoute = false;
				}
			} else {
				self.isAuthorized = false;
				self.isVerified = false;
			}
		}

		authBinding.addListener(updateAuth);	// subscribing on all auth info updates
		updateAuth();
	},
	/**
	 * Getting data from routing component
	 * @param routeComponent
	 * @returns {Array}
	 * @private
	 */
	_getRouteFromComponent: function(routeComponent) {
		var self = this,
			binding = self.getDefaultBinding(),
			routePath = routeComponent.props.path.split(' '),
			routes = [];

		routePath.forEach(function(currentRoute) {
			const routeData = {
				path: currentRoute,
				component: routeComponent.props.component,
				pageName: routeComponent.props.pageName || '',
				binding: routeComponent.props.binding || binding,
				unauthorizedAccess: routeComponent.props.unauthorizedAccess ? routeComponent.props.unauthorizedAccess : false,
				routeComponent: routeComponent
			};

			routes.push(routeData);

			if (routeComponent.props.loginRoute) {
				self.loginRoute = routeData;
			}

			if (routeComponent.props.verifyRoute) {
				self.verifyRoute = routeData;
			}
		});

		return routes;
	},
	/**
	 * Handling for parent component
	 * @param children
	 * @returns {Array}
	 */
	getRouteFromChildren: function(children) {
		var self = this,
			routes = [];

		children && children.forEach(function(route){
			// Processing nested routes
			if (route.props.children) {
				routes = routes.concat(self.getRouteFromChildren(route.props.children));
			} else {
				routes = routes.concat(self._getRouteFromComponent(route));
			}

		});

		return routes;
	},
	/**
	 * Setting route to be active
	 */
	setRoute: function(route) {
		const self = this;

		const req = require.context('../../', true, /^\.\/.*\.js$/);

		console.log('setting route: ' + route.component);

		// Loading path - related component
		const component = req('./' + route.component + '.js');

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
	 * @param route
	 */
	addRoute: function(route) {
		const self = this;

		self.siteRoutes[route.path] = function(){
			var pathParameters = Array.prototype.slice.call(arguments, 0);

			// Updating parametrized parts of path
			self.RoutingBinding.set('pathParameters', Immutable.fromJS(pathParameters));//set and remove parameters

			// User will be redirected to login page when unauthorized.
			// In this case latest routing is saved(which is really current route)
			if (route.unauthorizedAccess === true) {
				self.setRoute(route);
			} else {
				if (self.isAuthorized === false && self.loginRoute) {
					self.setRoute(self.loginRoute);
					//if latest routing(which is really current route) is a login, then don't save it
					if(self.loginRoute.path !== route.path)
						self.nextRoute = route;
				} else if (self.isVerified === false && self.verifyRoute) {
					self.setRoute(self.verifyRoute);
					self.nextRoute = route;
				} else {
					self.setRoute(route);
				}


			}
		}
	},
	updateUrlParametrs: function() {
		var self = this,
			urlHash = document.location.hash,
			parametersIndex = urlHash.indexOf('?'),
			parametersResult = {};


		if (parametersIndex !== -1) {
			urlHash = urlHash.substr(parametersIndex + 1);
			urlHash.split('&').forEach(function(oneParameter) {
				var parametrSplit = oneParameter.split('=');

				parametersResult[parametrSplit[0]] = decodeURIComponent(parametrSplit[1]);
			});
		}

		self.RoutingBinding.set('parameters', Immutable.fromJS(parametersResult));

	},
	componentWillMount: function() {
		const 	self 	= this,
				routes 	= self.getRouteFromChildren(self.props.children);

		self.isAuthorized = false;
		self.RoutingBinding = self.props.routes;
		self.currentPath = undefined;

		self.siteRoutes = {};
		self.siteComponents = {};

		// Adding site routes
		routes && routes.forEach( route => self.addRoute(route) );

		// Handling address(url) change
		window.addEventListener('popstate', self.updateUrlParametrs);

		// Binding authorization info
		self.bindToAuthorization();

		// router init
		self.updateUrlParametrs();


		self.routerInstance = Router.Router(self.siteRoutes);
		self.routerInstance.init();

	},
	render: function() {
		const 	self 			= this,
				currentPath 	= self.currentPath,
				siteComponent 	= self.siteComponents[currentPath];

		// Dirty ad-hoc solution. Router update required (wrote by somebody, I don't understand really)
		if (document.location.href.indexOf('#') === -1 || document.location.hash === '') {
			document.location = '#login';
		}

		return siteComponent ? React.createElement(siteComponent.View, siteComponent.routeComponent.props) : null;
	}
});

module.exports = RouterView;

