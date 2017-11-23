const 	SubMenu 			= require('module/ui/menu/sub_menu'),
	{If}					= require('module/ui/if/if'),
		React 				= require('react'),
		Immutable 			= require('immutable'),
		Morearty            = require('morearty'),
		RadioGroup 			= require('module/ui/radiogroup/radiogroup'),
		FixturesList 		= require('./fixtures_list'),
		FixturesStatistics 	= require('./fixture_statics');

const FixturesPage = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		var self = this;

		return Immutable.fromJS({
			sports: [],
			gameType: {
				defaultId: 'all',
				selectedId: undefined
			},
			gameSports: {
				list: [],
				selectedId: undefined
			},
			menuItems: [],
			fixtures: [],
			fixturesSync: false,
			opponentInfo: {}
		});
	},
	componentWillMount: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('activeSchoolId'),
			opponentId = globalBinding.sub('routing.parameters').toJS().opponentId;

		if (!activeSchoolId) {
			document.location.hash = 'schools';
		}


		window.Server.sports.get().then(function(data) {
			var menuItems = data.map(function(sport) {
				return {
					href: '/#fixtures?sport=' + encodeURIComponent(sport.name) + (opponentId ? '&opponentId=' + encodeURIComponent(opponentId) : ''),
					name: sport.name,
					key: sport.name
				}
			});

			binding.set('menuItems', menuItems);
			binding.set('gameSports.list', data);
			self._locateToFirstSport();
		});

		opponentId && window.Server.schoolInfo.get(opponentId).then(function (data) {
			binding.set('opponentInfo', Immutable.fromJS(data));
		});

		globalBinding.addListener('routing.parameters', self._setCurrentSportId.bind(self));
		binding.addListener('gameSports.selectedId', self._getDateFromServer.bind(self));
		binding.addListener('gameType.selectedId', self._getDateFromServer.bind(self));

		self._locateToFirstSport();

		self.gameTypes = [{
			id: 'all',
			value: 'All types'
		}, {
			id: 'internal',
			value: 'Internal'
		}, {
			id: 'houses',
			value: 'Houses'
		}, {
			id: 'inter-schools',
			value: 'Inter-schools'
		}];
	},
	_getDateFromServer: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('activeSchoolId'),
			currentSportId = binding.get('gameSports.selectedId'),
			currentGameType = binding.get('gameType.selectedId'),
			opponentId = globalBinding.sub('routing.parameters').toJS().opponentId,
			whereFilter = {};

		if (currentSportId) {
			whereFilter = {
				sportId: currentSportId
			};

			if (currentGameType && currentGameType !== 'all') {
				whereFilter.type = currentGameType;
			}


			window.Server[opponentId ? 'fixturesVsOtherSchool' : 'fixturesBySchoolId'].get({
				schoolId: activeSchoolId,
				opponentId: opponentId
			}, {
				filter: {
					include: 'sport',
					limit: 30,
					order: 'startTime asc',
					where: whereFilter
				}
			}).then(function(data) {
				binding.set('fixtures', Immutable.fromJS(data));
			});
		}
	},
	_setCurrentSportId: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			sports = binding.toJS('gameSports.list'),
			currentSportName = globalBinding.sub('routing.parameters').toJS().sport,
			currentSportId;

		if (sports) {
			for (var i = 0; i < sports.length; i++) {
				if (sports[i].name == currentSportName) {
					currentSportId = sports[i].id;
				}
			}

			binding.set('gameSports.selectedId', currentSportId);
		}
	},
	_locateToFirstSport: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			sports = binding.toJS('gameSports.list'),
			parametrs = globalBinding.sub('routing.parameters').toJS(),
			currentSportName = parametrs.sport,
			opponentId = parametrs.opponentId,
			newUrl = 'fixtures?';

		// Если в текущем адресе отсутствует id вида спорта, переходим на первый попавшийся
		if (!currentSportName && sports && sports[0]) {
			currentSportName = sports[0].name;
			newUrl = 'fixtures?sport=' + encodeURIComponent(currentSportName);

			if (opponentId) {
				newUrl += '&opponentId=' + encodeURIComponent(opponentId);
			}

			document.location.hash = newUrl;
		}

		self._setCurrentSportId();
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			currentSportId = binding.get('gameSports.selectedId'),
			opponentId = globalBinding.sub('routing.parameters').toJS().opponentId;

		return (
			<div>
				<SubMenu binding={{ default: globalBinding.sub('routing'), itemsBinding: binding.sub('menuItems') }} />

				<If condition={currentSportId}>
					<div className="bSchoolMaster">

						<If condition={!opponentId}>
							<RadioGroup name="Game types to show:" sourceArray={self.gameTypes} binding={binding.sub('gameType')} />
						</If>

						<If condition={binding.get('opponentInfo.name')}>
							<div>Fixtures vs {binding.get('opponentInfo.name')}</div>
						</If>

						<FixturesStatistics binding={binding.sub('fixtures')} />

						<FixturesList binding={binding.sub('fixtures')} />

					</div>
				</If>

			</div>
		)
	}
});


module.exports = FixturesPage;
