const	TeamManager			= require('./../../../../../ui/managers/team_manager/team_manager'),
		InvitesMixin 		= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		MoreartyHelper		= require('module/helpers/morearty_helper'),
		TeamHelper			= require('module/ui/managers/helpers/team_helper'),
		EventHelper			= require('module/helpers/eventHelper'),
		classNames			= require('classnames'),
		React				= require('react'),
		Immutable			= require('immutable'),
		Morearty			= require('morearty');

const EventTeamsView = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	componentWillMount: function() {
		const self = this;

		self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		self.initInitialPlayers();
		self.initFilter();
		self.initSelectedTeamIndex();

		self.addTeamStudentsListeners();
	},
	initInitialPlayers: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	event				= self.getBinding('event').toJS(),
				teamManagerBindings	= binding.toJS('teamManagerBindings');

		let initialPlayers;
		if(TeamHelper.isIndividualSport(event)) {
			// if individual sport - initialPlayers is array
			initialPlayers = teamManagerBindings[0].teamStudents;
		} else {
			initialPlayers = {};
			// if individual sport - initialPlayers is has map
			teamManagerBindings.forEach(teamManagerBinding => {
				initialPlayers[teamManagerBinding.teamId] = teamManagerBinding.teamStudents;
			});
		}

		binding.set('initialPlayers', Immutable.fromJS(initialPlayers));
	},
	initFilter: function() {
		const self = this;

		const	school	= self.getBinding('schoolInfo').toJS(),
				event	= self.getBinding('event').toJS();

		if(TeamHelper.isIndividualSport(event)) {
			switch (EventHelper.serverEventTypeToClientEventTypeMapping[event.eventType]) {
				case 'inter-schools':
				case 'internal':
					self.setPlayerChooserFilterForIndividuals(event, school);
					break;
				case 'houses':
					event.housesData.forEach(house => self.setPlayerChooserFilterForHousesIndividualEvent(house, event, school));
					break;
			}
		} else {
			event.teamsData.forEach(team => self.setPlayerChooserFilterForTeam(team, school));
		}
	},
	initSelectedTeamIndex: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const event = self.getBinding('event').toJS();

		if(!TeamHelper.isIndividualSport(event)) {
			binding.set(
				'selectedTeamId',
				Immutable.fromJS(
					event.teamsData.find(t => t.schoolId === self.activeSchoolId).id
				)
			);
		} else if(TeamHelper.isIndividualSport(event) && EventHelper.serverEventTypeToClientEventTypeMapping[event.eventType] === 'houses') {
			binding.set(
				'selectedTeamId',
				Immutable.fromJS(event.houses[0])
			);
		} else {
			binding.set('selectedTeamId',Immutable.fromJS(undefined));
		}
	},
	addTeamStudentsListeners: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.sub('teamManagerBindings.0.teamStudents').addListener(() => {
			binding.set('teamManagerBindings.1.teamStudents.blackList', Immutable.fromJS('teamManagerBindings.0.teamStudents'));
		});
		binding.sub('teamManagerBindings.1.teamStudents').addListener(() => {
			binding.set('teamManagerBindings.0.teamStudents.blackList', Immutable.fromJS('teamManagerBindings.1.teamStudents'));
		});
	},
	_getOtherTeamIndex: function(order) {
		return order === 0 ? 1 : 0;
	},
	/**
	 * Create
	 * @param event
	 * @param school
	 * @returns {{genders, houseId, schoolId, forms}|*}
	 */
	setPlayerChooserFilterForIndividuals: function(event, school) {
		const	self	= this,
				binding	=self.getDefaultBinding();

		const	gender	= TeamHelper.getFilterGender(event.gender),
				ages	= event.ages,
				houseId	= undefined;

		const filter = TeamHelper.getTeamManagerSearchFilter(
			school,
			ages,
			gender,
			houseId
		);

		binding.set(`teamManagerBindings.0.filter`, Immutable.fromJS(filter))
	},
	setPlayerChooserFilterForHousesIndividualEvent: function(house, event, school) {
		const	self	= this,
				binding	=self.getDefaultBinding();

		const	gender	= TeamHelper.getFilterGender(event.gender),
				ages	= event.ages,
				houseId	= house._id;

		const filter = TeamHelper.getTeamManagerSearchFilter(
			school,
			ages,
			gender,
			houseId
		);

		const	teamManagerBindings	= binding.toJS('teamManagerBindings'),
				foundIndex			= teamManagerBindings.findIndex(tmb => tmb.teamId === house._id);

		binding.set(`teamManagerBindings.${foundIndex}.filter`, Immutable.fromJS(filter));
	},
	setPlayerChooserFilterForTeam: function(team, school) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	gender	= TeamHelper.getFilterGender(team.gender),
				ages	= team.ages,
				houseId	= team.houseId;

		const filter = TeamHelper.getTeamManagerSearchFilter(
			school,
			ages,
			gender,
			houseId
		);

		const	teamManagerBindings	= binding.toJS('teamManagerBindings'),
				foundIndex			= teamManagerBindings.findIndex(tmb => tmb.teamId === team.id);

		binding.set(`teamManagerBindings.${foundIndex}.filter`, Immutable.fromJS(filter));
	},
	handleTeamClick: function(teamId) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.set('selectedTeamId', Immutable.fromJS(teamId));
	},
	renderTeamChooser: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const event = self.getBinding('event').toJS();

		if(EventHelper.serverEventTypeToClientEventTypeMapping[event.eventType] === 'houses' && TeamHelper.isIndividualSport(event)) {
			return event.housesData.map(house => {
				return (
					<button	key			= {house._id}
							className	= {self.getTeamButtonsClassName(house._id)}
							onClick		= {self.handleTeamClick.bind(self, house._id)}
					>
						{house.name}
					</button>
				);
			});
		} else {
			return binding.toJS('teamManagerBindings').map(data => {
				let result = null;

				const foundTeam = event.teamsData.find(t => t.id === data.teamId);
				if(
					typeof foundTeam !== 'undefined' &&
					TeamHelper.isTeamEnableForEdit(self.activeSchoolId, event, foundTeam)
				) {
					result = (
						<button	key			= {foundTeam.id}
								className	= {self.getTeamButtonsClassName(foundTeam.id)}
								onClick		= {self.handleTeamClick.bind(self, foundTeam.id)}
						>
							{foundTeam.name}
						</button>
					);
				}

				return result;
			});
		}
	},
	getTeamButtonsClassName: function(teamId) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return classNames({
			bEventTeams_teamButton:	true,
			mRightMargin:			true,
			mSelected:				binding.toJS('selectedTeamId') === teamId
		});
	},
	_renderTeamEditHeader: function() {
		const self = this;

		return (
			<div className="bEventTeams_header">
				{self.renderTeamChooser()}
			</div>
		);
	},
	render: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	event				= self.getBinding('event').toJS(),
				isIndividualSport	= TeamHelper.isIndividualSport(event);

		if(
			EventHelper.isEventWithOneIndividualTeam(event) ||
			(
				EventHelper.serverEventTypeToClientEventTypeMapping[event.eventType] === 'inter-schools' &&
				isIndividualSport
			)
		) {
			return (
				<div className="bEventTeams">
					<div className="bEventTeams_TeamWrapper">
						<TeamManager	isIndividualSport={isIndividualSport}
										binding={binding.sub(`teamManagerBindings.0`)}
						/>
					</div>
				</div>
			);
		} else {
			return (
				<div className="bEventTeams">
					{self._renderTeamEditHeader()}
					{
						binding.toJS('teamManagerBindings').map((data, index) => {
							const teamWrapperClassName = classNames({
								bEventTeams_TeamWrapper:	true,
								mDisabled:					binding.toJS('selectedTeamId') !== data.teamId
							});

							return (
								<div className={teamWrapperClassName}>
									<TeamManager	isIndividualSport={isIndividualSport}
													binding={binding.sub(`teamManagerBindings.${index}`)}/>
								</div>
							);
						})
					}
				</div>
			);
		}
	}
});

module.exports = EventTeamsView;
