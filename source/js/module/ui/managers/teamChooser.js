const	React			= require('react'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
		classNames		= require('classnames'),
		Immutable		= require('immutable');

const	TeamChooser	= React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onTeamClick: React.PropTypes.func
	},
	componentWillMount: function () {
		const self = this;

		self._initBinding();
	},
	_initBinding: function() {
		const	self = this,
				binding	= self.getDefaultBinding();

		self._getTeams().then((teams) => {
			binding
				.atomically()
				.set('teams', Immutable.fromJS(teams))
				.set('viewMode', Immutable.fromJS('close'))
				.commit();
		});
	},
	_getTeams: function() {
		const	self	= this,
				model	= self.getBinding().model.toJS(),
				rival	= self.getBinding().rival.toJS(),
				filter	= {
					where: {
						schoolId:	MoreartyHelper.getActiveSchoolId(self),
						gender:		model.gender,
						sportId:	model.sportId,
						tempTeam:	false,
						ages:		{inq: model.ages}
					},
					include: ['sport','players']
				};

		return window.Server.teams.get({filter: filter}).then((teams)  => {
			let	filteredTeams = [];

			teams.forEach((team) => {
				if(team.ages.length <= model.ages.length) {
					switch (model.type) {
						case 'houses':
							if(self._isAllPlayersFromHouse(rival.id, team.players)) {
								filteredTeams.push(team);
							}
							break;
						default:
							filteredTeams.push(team);
							break;
					}
				}
			});

			return filteredTeams;
		});
	},
	/**
	 *
	 * @param houseId
	 * @param players
	 * @returns {boolean} true if all players from current house
	 * @private
	 */
	_isAllPlayersFromHouse: function(houseId, players) {
		let	isAllFromCurrentHouse = true;

		for (let i = 0; i < players.length; i++) {
			if(players[i].houseId != houseId) {
				isAllFromCurrentHouse = false;
				break;
			}
		}

		return isAllFromCurrentHouse;
	},
	/**
	 * Convert ages array to table view
	 * @private
	 */
	_geAgesView: function(ages) {
		let	result = '';

		if (ages !== undefined) {
			result = ages.map(elem => {
				return `Y${elem}`;
			}).join(";");
		}

		return result;
	},
	/**
	 * Handler for click on team in team table
	 * @param teamId
	 * @private
	 */
	_onTeamClick: function(teamId, team) {
		const	self = this;

		self._closeTeamList();
		self.props.onTeamClick(teamId, team);
	},
	_renderTeamList: function() {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				teams			= binding.toJS('teams'),
				exceptionTeamId	= binding.toJS('exceptionTeamId');
		let		teamItems		= [];

		if(teams) {
			teams.forEach(team => {
				if(exceptionTeamId != team.id) {
					teamItems.push((
						<div className="eTeamChooser_team" onMouseDown={self._onTeamClick.bind(self, team.id, team)}>
							<div className="eTeamChooser_teamName">{team.name}</div>
							<div className="eTeamChooser_teamAges">{self._geAgesView(team.ages)}</div>
						</div>
					)) ;
				}
			});
		}

		const	teamChooserClass	= classNames({
			eTeamChooser_teamList:	true,
			mDisable:				binding.toJS('viewMode') == 'close'
		});

		return (
			<div className={teamChooserClass}>
				{teamItems}
			</div>
		);
	},
	_onTeamChooserButtonClick: function() {
		const	self			= this,
				binding			= self.getDefaultBinding();

		switch (binding.toJS('viewMode')) {
			case 'open':
				self._closeTeamList();
				break;
			case 'close':
				self._openTeamList();
				break;
		}
	},
	_onTeamChooserButtonBlur: function() {
		const	self	= this;

		self._closeTeamList();
	},
	_openTeamList: function() {
		const	self	= this;

		self.getDefaultBinding().set('viewMode', Immutable.fromJS('open'));
	},
	_closeTeamList: function() {
		const	self	= this;

		self.getDefaultBinding().set('viewMode', Immutable.fromJS('close'));
	},
	render: function() {
		const	self	= this;

		return (
			<div class="bTeamChooser">
				<div	className="eTeamChooser_button"
						onClick={self._onTeamChooserButtonClick}
						onBlur={self._onTeamChooserButtonBlur}
				>
					Choose Team
				</div>
				{self._renderTeamList()}
			</div>
		);
	}
});

module.exports = TeamChooser;