var CalendarPage,
	SubMenu = require('module/ui/menu/sub_menu'),
	DateTimeMixin = require('module/mixins/datetime'),
	Calendar = require('module/ui/calendar/big_calendar');

CalendarPage = React.createClass({
	mixins: [Morearty.Mixin, DateTimeMixin],
	componentWillMount: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding();

		// Пункты подменю
		self.menuItems = [{
			href: '/#calendar',
			name: 'All sports',
			key: 'all'
		},{
			href: '/#fixtures?sport=netball',
			name: 'Netball',
			key: 'Netball'
		},{
			href: '/#fixtures?sport=hockey',
			name: 'Hockey',
			key: 'hockey'
		},{
			href: '/#fixtures?sport=rugby',
			name: 'Rugby',
			key: 'rugby'
		},{
			href: '/#fixtures?sport=rounders',
			name: 'Rounders',
			key: 'rounders'
		},{
			href: '/#fixtures?sport=football',
			name: 'Football',
			key: 'football'
		},{
			href: '/#fixtures?sport=cricket',
			name: 'Cricket',
			key: 'cricket'
		}];
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div>
				<SubMenu binding={binding.sub('calendarRouting')} items={self.menuItems} />

				<Calendar />
			</div>
		)
	}
});


module.exports = CalendarPage;
