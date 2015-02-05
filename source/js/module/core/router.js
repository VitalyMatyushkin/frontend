var RouterView;


RouterView = React.createClass({
	mixins: [Morearty.Mixin],
	getRoutes: function() {
		var self = this,
			routes = [],
			binding = self.getDefaultBinding();

		self.props.children.forEach(function(route){
			routes.push({
				path: route.props.path,
				component: route.props.component,
				pageName: route.props.pageName,
				binding: route.props.binding || binding
			});
		});

		return routes;
	},
	/**
	 * Добавление нового маршрута
	 * @param route
	 */
	addRoute: function(route){
		var self = this;

		self.siteRoutes[route.path] = function(){

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
		}
	},
	componentWillMount: function() {
		var self = this,
			routes = self.getRoutes();

		self.RoutingBinding = self.props.routes;
		self.currentPath = undefined;

		self.siteRoutes = {};
		self.siteComponents = {};

		// Добавление маршрутов сайта
		routes && routes.forEach(function(route){
			self.addRoute(route);
		});

		// Инициализации маршрутизатора
		Router(self.siteRoutes).init();
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			siteComponent = self.siteComponents[self.currentPath];

		return siteComponent ? React.createElement(siteComponent.View, {binding: siteComponent.binding}) : null;
	}
});

module.exports = RouterView;

