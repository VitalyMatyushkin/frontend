const 	{SubMenu} 		= require('module/ui/menu/sub_menu'),
		DateTimeMixin 	= require('module/mixins/datetime'),
		Calendar 		= require('module/ui/calendar/big_calendar'),
		Immutable		= require('immutable'),
		Morearty        = require('morearty'),
		React 			= require('react');

const CalendarPage = React.createClass({
	mixins: [Morearty.Mixin, DateTimeMixin],
	getDefaultState: function () {
		var self = this;

		return Immutable.fromJS({
			sports: [],
			selectedSportId: undefined,
			sportsList: [],
			currentDate: (new Date()).toISOString(),
			menuItems: [{
				href: '/#calendar?sport=all',
				name: 'All sports',
				key: 'all'
			}],
			fixtures: []
		});
	},
	componentWillMount: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('activeSchoolId');

		if (!activeSchoolId) {
			document.location.hash = 'schools';
		}

		window.Server.sports.get().then(function(data) {
			var menuItems = data.map(function(sport) {
				return {
					href: '/#calendar?sport=' + encodeURIComponent(sport.name),
					name: sport.name,
					key: sport.name
				}
			});

			menuItems.unshift({
				href: '/#calendar?sport=all',
				name: 'All sports',
				key: 'all'
			});

			binding.set('menuItems', menuItems);
			binding.set('sportsList', data);
		});

		globalBinding.addListener('routing.parameters', self._setCurrentSportId.bind(self));
		binding.addListener('selectedSportId', self._getDateFromServer.bind(self));
		binding.addListener('currentDate', self._getDateFromServer.bind(self));

		self._getDateFromServer();
	},
	_getDateFromServer: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('activeSchoolId'),
			currentSportId = binding.get('selectedSportId'),
			currentDate = new Date(binding.get('currentDate')),
			currentMonth = currentDate.getMonth(),
			currentYear = currentDate.getFullYear(),
			whereFilter = {};

		if (currentSportId && currentSportId !== 'all') {
			whereFilter.sportId = currentSportId;
		}

		whereFilter.startTime = {
			between: [new Date(currentYear, currentMonth, 1).toISOString(), new Date(currentYear, currentMonth + 1, 0).toISOString()]
		};

		window.Server.fixturesBySchoolId.get(activeSchoolId, {
			filter: {
				include: 'sport',
				limit: 250,
				order: 'startTime asc',
				where: whereFilter
			}
		}).then(function(data) {
			var monthFixtures = {};

			data.forEach(function(fixture) {
				var day = (new Date(fixture.startTime)).getDate();

				if (!monthFixtures[day]) {
					monthFixtures[day] = [];
				}

				monthFixtures[day].push(fixture);
			});

			binding.set('fixtures.'+currentYear+'.'+currentMonth, Immutable.fromJS(monthFixtures));
		});
	},
	_setCurrentSportId: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			sports = binding.toJS('sportsList'),
			currentSportName = globalBinding.sub('routing.parameters').toJS().sport,
			currentSportId;

		if (sports) {
			for (var i = 0; i < sports.length; i++) {
				if (sports[i].name == currentSportName) {
					currentSportId = sports[i].id;
				}
			}

			binding.set('selectedSportId', currentSportId);
		}
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding();

		return (
			<div>
				<SubMenu binding={{ default: globalBinding.sub('routing'), itemsBinding: binding.sub('menuItems') }} />

				<Calendar binding={binding} />
			</div>
		)
	}
});


module.exports = CalendarPage;
