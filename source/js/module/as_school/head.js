const 	Logo 		= require('module/as_school/head/logo'),
		TopMenu 	= require('module/ui/menu/public_menu'),
		React 		= require('react');

const Head = React.createClass({
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
		const 	self 	= this,
				binding = this.getDefaultBinding();

		return (
			<div className="bTopPanel schoolPanel">
                <TopMenu menuItems={['school','fixtures','cricket','rounders','rugby','netball','football','hockey']}></TopMenu>
				<Logo />

			</div>
		)
	}
});

module.exports = Head;
