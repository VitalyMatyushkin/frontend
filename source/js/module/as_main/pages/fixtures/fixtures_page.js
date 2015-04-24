var FixturesPage,
	SubMenu = require('module/ui/menu/sub_menu');

FixturesPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('activeSchoolId');

		if (!activeSchoolId) {
			document.location.hash = 'schools';
		}

		window.Server.school.get(activeSchoolId).then(function (data) {
			binding.set('schoolInfo', Immutable.fromJS(data));
		});

		// Пункты подменю
		self.menuItems = [{
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

	getDefaultState: function () {
		return Immutable.fromJS({

		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding();

		// Temporary fun :D
		document.location.hash = 'fixtures?sport=netball';

		return (
			<div>
				<SubMenu binding={binding.sub('fixturesRouting')} items={self.menuItems} />

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

			</div>
		)
	}
});


module.exports = FixturesPage;
