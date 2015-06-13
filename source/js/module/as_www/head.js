var Logo = require('module/as_www/head/logo'),
	TopMenu = require('module/ui/menu/top_menu'),
	Head;

Head = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		var self = this,
			menuItems;

		self.menuItems = [];
	},
	render: function() {
		var self = this,
			binding = this.getDefaultBinding();

		return (
			<div className="bTopPanel">
				<Logo />
				<TopMenu items={self.menuItems} binding={binding.sub('routing')} />
			</div>
		)
	}
});

module.exports = Head;
