const 	Immutable 	= require('immutable'),
		//Router = require('Router'),
		React 		= require('react');


const RouterView = React.createClass({
	mixins: [Morearty.Mixin],
	isAuthorized: false,
	isVerified: false,
	bindToAuthorization: function() {
		var self = this,
			authBinding = self.getDefaultBinding().sub('userData.authorizationInfo');

		function updateAuth() {
			var data = authBinding.toJS();

			// TODO: make check a bit easier. Add policy/rules check?
			if (data && data.id && data.verified) {
				self.isAuthorized = true;

				// Redirecting to verification page
				if (!data.verified.email ||  !data.verified.phone) {
					self.isVerified = false;
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

		authBinding.addListener(updateAuth);
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
		var self = this;

		// Loading path - related component
		window['require']([route.component], function (ComponentView) {

			self.siteComponents[route.path] = {
				View: ComponentView,
				routeComponent: route.routeComponent,
				binding: route.binding
			};

			self.currentPath = route.path;
			self.isMounted() && self.forceUpdate();
			self.RoutingBinding.atomically()
				.set('currentPath', self.currentPath)
				.set('currentPathParts', self.currentPath.split('/').filter(Boolean))
				.set('currentPageName', route.pageName)
				.commit();
		});
	},
	/**
	 * Adding new route
	 * @param route
	 */
	addRoute: function(route) {
		var self = this;

		self.siteRoutes[route.path] = function(){
			var pathParameters = Array.prototype.slice.call(arguments, 0);

			// Updating parametrized parts of path
			//pathParameters.length && self.RoutingBinding.set('pathParameters', Immutable.fromJS(pathParameters)); //parameters are not removed!!!
			self.RoutingBinding.set('pathParameters', Immutable.fromJS(pathParameters));//set and remove parameters

			// User will be redirected to login page when unauthorized.
			// In this case latest routing is saved
			if (route.unauthorizedAccess === true) {
				self.setRoute(route);
			} else {
				if (self.isAuthorized === false && self.loginRoute) {
					self.setRoute(self.loginRoute);
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

		//console.log("self: " + self);
		self.RoutingBinding.set('parameters', Immutable.fromJS(parametersResult));

	},
	componentWillMount: function() {
		var self = this,
			routes = self.getRouteFromChildren(self.props.children);

		self.isAuthorized = false;
		self.RoutingBinding = self.props.routes;
		self.currentPath = undefined;

		self.siteRoutes = {};
		self.siteComponents = {};

		// Adding site routes
		routes && routes.forEach(function(route){
			self.addRoute(route);
		});

		// Handling address(url) change
		window.addEventListener('popstate', self.updateUrlParametrs);

		// Binding authorization info
		self.bindToAuthorization();

		// router init
		self.updateUrlParametrs();

		self.routerInstance = window.Router(self.siteRoutes);
		self.routerInstance.init();
	},
	render: function() {
		var self = this,
			currentPath = self.currentPath,
			siteComponent = self.siteComponents[currentPath];

		// Dirty ad-hoc solution. Router update required (wrote by somebody, I don't understand really)
		if (document.location.href.indexOf('#') === -1 || document.location.hash === '') {
			document.location = '#login';
		}

		return siteComponent ? React.createElement(siteComponent.View, siteComponent.routeComponent.props) : null;
	}
});

module.exports = RouterView;

