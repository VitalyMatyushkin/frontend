var FixturesPage,
	SubMenu = require('module/ui/menu/sub_menu'),
	If = require('module/ui/if/if'),
	RadioGroup = require('module/ui/radiogroup/radiogroup');

FixturesPage = React.createClass({
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
			menuItems: []
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
					href: '/#fixtures?sport=' + sport.name,
					name: sport.name,
					key: sport.name
				}
			});

			binding.set('menuItems', menuItems);
			binding.set('gameSports.list', data);
			self._locateToFirstSport();
		});

		globalBinding.addListener('routing.parameters', self._setCurrentSportId.bind(self));

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
			currentSportName = globalBinding.sub('routing.parameters').toJS().sport;

		// Если в текущем адресе отсутствует id вида спорта, переходим на первый попавшийся
		if (!currentSportName && sports && sports[0]) {
			currentSportName = sports[0].name;
			document.location.hash = 'fixtures?sport=' + currentSportName;
		}

		self._setCurrentSportId();
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			currentSportId = binding.get('gameSports.selectedId');

		return (
			<div>
				<SubMenu binding={{ default: globalBinding.sub('routing'), itemsBinding: binding.sub('menuItems') }} />

				<If condition={currentSportId}>
					<div className="bSchoolMaster">

						<RadioGroup name="Game types to show:" sourceArray={self.gameTypes} binding={binding.sub('gameType')} />

						<div className="bFixturesStatics">
							<div className="eFixturesStatics_number">
								<div className="eFixturesStatics_value">71</div>
								<div className="eFixturesStatics_name">played</div>
							</div>

							<div className="eFixturesStatics_number">
								<div className="eFixturesStatics_value">22</div>
								<div className="eFixturesStatics_name">won</div>
							</div>

							<div className="eFixturesStatics_number">
								<div className="eFixturesStatics_value">3</div>
								<div className="eFixturesStatics_name mTwoLines">average<br/>points</div>
							</div>
						</div>



						<div className="bFixturesList">

							<div className="bChallengeDate">
								<div className="eChallengeDate_date">Fri 16 Apr 2015</div>
								<div className="eChallengeDate_list">

									<div className="bChallenge">
										<div className="eChallenge_in">
											<div className="eChallenge_rivalName">
												<span>GIRLS U11AC</span></div>

											<div className="eChallenge_rivalInfo">
												<div className="eChallenge_hours">23:00</div>
												<div className="eChallenge_results mDone">5 : 5</div>
												<div className="eChallenge_info">internal</div>
											</div>
											<div className="eChallenge_rivalName">
												<span>GIRLS U14A</span></div>
										</div>
									</div>


								</div>
							</div>



							<div className="bChallengeDate">
								<div className="eChallengeDate_date">Sa 22 May 2015</div>
								<div className="eChallengeDate_list">

									<div className="bChallenge">
										<div className="eChallenge_in">
											<div className="eChallenge_rivalName">
												<span>BOYS U14C</span></div>

											<div className="eChallenge_rivalInfo">
												<div className="eChallenge_hours">7:00</div>
												<div className="eChallenge_results">? : ?</div>
												<div className="eChallenge_info">inter-schools</div>
											</div>
											<div className="eChallenge_rivalName">
												<span>BOYS U14B</span></div>
										</div>
									</div>

									<div className="bChallenge">
										<div className="eChallenge_in">
											<div className="eChallenge_rivalName">
												<span>BOYS U2A</span></div>

											<div className="eChallenge_rivalInfo">
												<div className="eChallenge_hours">15:00</div>
												<div className="eChallenge_results">? : ?</div>
												<div className="eChallenge_info">inter-schools</div>
											</div>
											<div className="eChallenge_rivalName">
												<span>BOYS U4A</span></div>
										</div>
									</div>

								</div>
							</div>


						</div>




					</div>
				</If>

			</div>
		)
	}
});


module.exports = FixturesPage;
