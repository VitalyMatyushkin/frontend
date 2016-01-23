var Logo = require('module/as_school/head/logo'),
	TopMenu = require('module/ui/menu/public_menu'),
    PublicLogin = require('module/ui/menu/public_login'),
	React = require('react'),
	Head;
Head = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		var self = this,
			menuItems;

		//self.menuItems = [{
		//	href: '/#school/fixtures',
		//	icon: 'icon_home',
		//	name: 'School',
		//	key: 'School',
		//	routes: ['/school/:subPage', '/']
		//},{
		//	href: '/#fixtures',
		//	icon: 'icon_shot',
		//	name: 'Fixtures',
		//	key: 'Fixtures',
		//	routes: ['/fixtures', '/event']
		//},{
		//	href: '/#calendar?sport=all',
		//	icon: 'icon_calendar',
		//	name: 'Calendar',
		//	key: 'Calendar',
		//	routes: ['/calendar']
		//},{
		//	href: '/#opponents/map',
		//	icon: 'icon_teams',
		//	name: 'Opponents',
		//	key: 'Opponents',
		//	routes: ['/opponents', '/opponents/:subPage']
		//},{
		//	href: '/#media',
		//	icon: 'icon_teams',
		//	name: 'Media',
		//	key: 'Media',
		//	routes: ['/media']
		//}];
	},
	render: function() {
		var self = this,
			binding = this.getDefaultBinding();

		return (
			<div className="bTopPanel">
                <TopMenu menuItems={['school','fixtures','cricket','rounders','rugby','netball','football','hockey']}></TopMenu>
				<Logo />
			</div>
		)
	}
});

module.exports = Head;
