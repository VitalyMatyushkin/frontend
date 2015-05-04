var FixturesPage,
	SubMenu = require('module/ui/menu/sub_menu'),
	If = require('module/ui/if/if');

FixturesPage = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		var self = this;

		return Immutable.fromJS({
			sports: []
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

			binding.meta().set('items', menuItems);
			binding.set('sports', data);
			self._locateToFirstSport();
		});

		globalBinding.addListener('routing.parameters', self._setCurrentSportId.bind(self));

		self._locateToFirstSport();
	},
	_setCurrentSportId: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			sports = binding.toJS('sports'),
			currentSportName = globalBinding.sub('routing.parameters').toJS().sport,
			currentSportId;

		if (sports) {
			for (var i = 0; i < sports.length; i++) {
				if (sports[i].name == currentSportName) {
					currentSportId = sports[i].id;
				}
			}

			binding.meta().set('currentSportId', currentSportId);
		}
	},
	_locateToFirstSport: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			sports = binding.toJS('sports'),
			currentSportName = globalBinding.sub('routing.parameters').toJS().sport;

		// Если в текущем адресе отсутствует id вида спорта, переходим на первый попавшийся
		if (!currentSportName && sports && sports[0]) {
			currentSportName = sports[0].name;
			document.location.hash = 'fixtures?sport=' + currentSportName;
		}

		self._setCurrentSportId();
	},
	getDefaultState: function () {
		return Immutable.fromJS({

		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			currentSportId = binding.meta().get('currentSportId');

		return (
			<div>
				<SubMenu binding={{ default: globalBinding.sub('routing'), itemsBinding: binding.meta().sub('items') }} />
				{currentSportId}
				<If condition={currentSportId}>
					<div className="bSchoolMaster">


						<div className="bRadioGroupMy">
							<label className="eRadioGroupMy_label">Game types to show:</label>
							<label className="eRadioGroupMy_label"><input checked type="radio" />All types</label>
							<label className="eRadioGroupMy_label"><input type="radio" />Internal</label>
							<label className="eRadioGroupMy_label"><input type="radio" />Houses</label>
							<label className="eRadioGroupMy_label"><input type="radio" />Inter-schools</label>
						</div>


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
