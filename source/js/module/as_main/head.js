var Logo = require('module/as_main/head/logo'),
	TopMenu = require('module/ui/menu/top_menu'),
	Head;

Head = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		var self = this,
			menuItems;

		self.menuItems = [{
			href: '/#school/summary',
			icon: 'icon_home',
			name: 'School',
			key: 'School',
			routes: ['/school', '/']
		},{
			href: '/#teams/summary',
			icon: 'icon_teams',
			name: 'Teams',
			key: 'Teams',
			routes: ['/teams']
		},
		{
			href: '/#fixtures',
			icon: 'icon_shot',
			name: 'Fixtures',
			key: 'Fixtures',
			routes: ['/fixtures']
		}];
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
