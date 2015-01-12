var RouterView;


RouterView = React.createClass({
	mixins: [Morearty.Mixin],
	getRoutes: function() {
		var self = this,
			routes = [];

		self.props.children.forEach(function(route){
			routes.push({
				path: route.props.path,
				component: route.props.component,
				pageName: route.props.pageName
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

		self.site_routes[route.path] = function(){

			// Загрузка компонента, соответствующего пути
			window['require']([route.component], function (ComponentView) {
				self.CurrentComponent = ComponentView;
				self.forceUpdate();
				self.RoutingBinding.set('current_page', route.pageName);
			});
		}
	},
	componentWillMount: function() {
		var self = this,
			routes = self.getRoutes();

		self.RoutingBinding = self.props.routes;
		self.CurrentPage = undefined;
		self.site_routes = {};

		// Добавление маршрутов сайта
		routes && routes.forEach(function(route){
			self.addRoute(route);
		});

		// Инициализации маршрутизатора
		Router(self.site_routes).init();
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			CurrentComponent = self.CurrentComponent;

		return CurrentComponent ? React.createElement(CurrentComponent, {binding: binding}) : null;
	}
});

module.exports = RouterView;

