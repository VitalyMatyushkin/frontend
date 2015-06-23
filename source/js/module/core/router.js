var RouterView;


RouterView = React.createClass({
	mixins: [Morearty.Mixin],
	isAuthorized: false,
	isVerified: false,
	bindToAuthorization: function() {
		var self = this,
			authBinding = self.getDefaultBinding().sub('userData.authorizationInfo');

		function updateAuth() {
			var data = authBinding.toJS();

			// TODO: упросить проверку, добавит права?
			if (data && data.id && data.verified) {
				self.isAuthorized = true;

				// Перенаправление на страницу верификации
				if (!data.verified.email ||  !data.verified.phone) {
					self.isVerified = false;
				} else {
					self.isVerified = true;
					// В случае возобновления авторизиаця перенаправяем пользователя на ожидаему страницу
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
	 * Получение данных из компонента роутинга
	 * @param routeComponent
	 * @returns {Array}
	 * @private
	 */
	_getRouteFromComponent: function(routeComponent) {
		var self = this,
			routePath = routeComponent.props.path.split(' '),
			routes = [];

		routePath.forEach(function(currentRoute) {
			var routeData = {
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
	 * Обработка родительский компонентов
	 * @param children
	 * @returns {Array}
	 */
	getRouteFromChildren: function(children) {
		var self = this,
			routes = [];

		children && children.forEach(function(route){
			// Обработка вложенных маршрутов
			if (route.props.children) {
				routes = routes.concat(self.getRouteFromChildren(route.props.children));
			} else {
				routes = routes.concat(self._getRouteFromComponent(route));
			}

		});

		return routes;
	},
	/**
	 * Установка заданного маршрута, как активного
	 */
	setRoute: function(route) {
		var self = this;

		// Загрузка компонента, соответствующего пути
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
	 * Добавление нового маршрута
	 * @param route
	 */
	addRoute: function(route){
		var self = this;

		self.siteRoutes[route.path] = function(){
			var pathParameters = Array.prototype.slice.call(arguments, 0);

			// Обновление значений параметрезированных частей пути
			pathParameters.length && self.RoutingBinding.set('pathParameters', Immutable.fromJS(pathParameters));

			// В случае отсутсвия авторизации принудительно перенаправляем на страницу логина
			// при этом сохраняем последний намеченный роутинг
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

		// Добавление маршрутов сайта
		routes && routes.forEach(function(route){
			self.addRoute(route);
		});

		// Обработка изменений адреса
		window.addEventListener('popstate', self.updateUrlParametrs.bind(self));

		// Связывание с инфорамцией об авторизации
		self.bindToAuthorization();

		// Инициализации маршрутизатора
		self.updateUrlParametrs();


		self.routerInstance = Router(self.siteRoutes);
		self.routerInstance.init();

	},
	render: function() {
		var self = this,
			currentPath = self.currentPath,
			siteComponent = self.siteComponents[currentPath];

		// Вынужденный костыль, надо сменить роутер :D
		if (document.location.href.indexOf('#') === -1 || document.location.hash === '') {
			document.location = '#/login';
		}

		return siteComponent ? React.createElement(siteComponent.View, siteComponent.routeComponent.props) : null;
	}
});

module.exports = RouterView;

