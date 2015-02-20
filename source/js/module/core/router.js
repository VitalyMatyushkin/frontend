var RouterView;


RouterView = React.createClass({
	mixins: [Morearty.Mixin],
	bindToAuthorization: function() {
		var self = this,
			binding = self.getDefaultBinding().sub('userData');

		function updateAuth() {
			var data = binding.get('authorizationInfo');

			if(data && (data = data.toJS()) && data.id){
				// В случае возобновления авторизиаця перенаправяем пользователя на ожидаему страницу
				self.isAuthorized = true;
				self.nextRoute && self.setRoute(self.nextRoute);
				self.nextRoute = false;
			} else {
				self.isAuthorized = false;
			}
		}

		binding.addListener('authorizationInfo', updateAuth);
		updateAuth();
	},
	getRoutes: function() {
		var self = this,
			routes = [],
			binding = self.getDefaultBinding();

		self.props.children.forEach(function(route){
			var routeData = {
				path: route.props.path,
				component: route.props.component,
				pageName: route.props.pageName,
				binding: route.props.binding || binding
			};

			routes.push(routeData);

			if (route.props.loginRoute) {
				self.loginRoute = routeData;
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
				binding: route.binding
			};

			self.currentPath = route.path;
			self.forceUpdate();
			self.RoutingBinding.set('current_page', route.pageName);
		});
	},
	/**
	 * Добавление нового маршрута
	 * @param route
	 */
	addRoute: function(route){
		var self = this;

		self.siteRoutes[route.path] = function(){
			// В случае отсутсвия авторизации принудительно перенаправляем на страницу логина
			// при этом сохраняем последний намеченный роутинг
			if (self.isAuthorized === false && self.loginRoute) {
				self.setRoute(self.loginRoute);
				self.nextRoute = route;
			} else {
				self.setRoute(route);
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

				parametersResult[parametrSplit[0]] = parametrSplit[1];
			});
		}

		self.RoutingBinding.set('parameters', Immutable.fromJS(parametersResult));

	},
	componentWillMount: function() {
		var self = this,
			routes = self.getRoutes();

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
		self.routerInstance .init();
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			siteComponent = self.siteComponents[self.currentPath];

		return siteComponent ? React.createElement(siteComponent.View, {binding: siteComponent.binding}) : null;
	}
});

module.exports = RouterView;

