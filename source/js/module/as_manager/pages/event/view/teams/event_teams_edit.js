const	InvitesMixin 		= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		PlayerChooser 		= require('module/ui/managers/player_chooser'),
		MoreartyHelper		= require('module/helpers/morearty_helper'),
		Team 				= require('module/ui/managers/team/defaultTeam'),
		TeamHelper			= require('module/ui/managers/helpers/team_helper'),
		classNames			= require('classnames'),
		React				= require('react'),
		Immutable			= require('immutable'),
		Morearty			= require('morearty');

const EventTeamsView = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	componentWillMount: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		const	school	= self.getBinding('schoolInfo').toJS(),
				event	= self.getBinding('event').toJS();

		binding.atomically()
			.set('initialPlayers',		Immutable.fromJS(binding.toJS('players')))
			.set('selectedRivalIndex',	Immutable.fromJS(0))
			// TODO need refactoring
			// prepare data for team react component
			// team react component data structure need refactoring
			// so it's dirty trick
			.set('schoolInfo',			Immutable.fromJS(school))
			.set('model',				Immutable.fromJS(event))
			.set('selectedTeamIndex',	Immutable.fromJS(0))
			// TODO move filter to props of playerChooser
			.set('filter',				Immutable.fromJS(self._getPlayerChooserFilters(event, school)))
			.commit();
	},
	_getPlayerChooserFilters: function(event, school) {
		const self = this;

		return event.participants.map(team => self._getPlayerChooserFilter(team, school));
	},
	_getOtherTeamIndex: function(order) {
		return order === 0 ? 1 : 0;
	},
	//TODO move to helpers
	_getPlayerChooserFilter: function(team, school) {
		const	self = this;

		return {
			gender:		team.gender,
			houseId:	team.houseId,
			schoolId:	school.id,
			forms:		self._getFilteredAgesBySchoolForms(team.ages, school.forms)
		};
	},
	_getFilteredAgesBySchoolForms: function(ages, schoolForms) {
		return schoolForms.filter((form) => {
			return	ages.indexOf(parseInt(form.age)) !== -1 ||
				ages.indexOf(String(form.age)) !== -1;
		});
	},
	_getPlayersManager: function(order) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const teamBinding = {
				default: binding,
				rivalId: self.getBinding('event').sub(`participants.${order}.id`),
				players: binding.sub(['players', order])
			};

		return (
			<Team binding={teamBinding} />
		);
	},
	_onTeamClick: function(order) {
		const	self	= this,
			binding	= self.getDefaultBinding();

		binding.set('selectedTeamIndex', Immutable.fromJS(order));
	},
	_renderPlayerChooser: function (order) {
		const	self	= this,
			binding	= self.getDefaultBinding();

		const playerChooserBinding = {
			default:			binding,
			rival:				self.getBinding('event').sub(['participants', order]),
			teamPlayers:		binding.sub(['players', order]),
			selectedRivalIndex:	binding.sub('selectedRivalIndex'),
			otherTeamPlayers:	binding.sub(['players', self._getOtherTeamIndex(order)]),
			filter:				binding.sub(`filter.${order}`)
		};

		return (
			<PlayerChooser binding={playerChooserBinding} />
		);
	},
	_renderPlayerByOrder: function(order) {
		const self = this;

		return (
			<div>
				<div className="eEventTeams_managerWrapper">
					{self._getPlayersManager(order)}
				</div>
				{self._renderPlayerChooser(order)}
			</div>
		);
	},
	_renderChooseTeamButtons: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const event = self.getBinding('event').toJS();

		return event.participants.filter(team => TeamHelper.isTeamEnableForEdit(self.activeSchoolId, event, team)).map((team, index) => {
			const teamButtonClassName = classNames(
				{
					bEventTeams_teamButton:	true,
					mRightMargin:			true,
					mSelected:				binding.toJS('selectedTeamIndex') === index
				}
			);

			return (
				<button	className={teamButtonClassName}
						onClick={self._onTeamClick.bind(self, index)}
				>
					{team.name}
				</button>
			);
		})
	},
	_renderTeamEditHeader: function() {
		const self = this;

		return (
			<div className="bEventTeams_header">
				{self._renderChooseTeamButtons()}
			</div>
		);
	},
	_renderPlayers: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return self._renderPlayerByOrder(binding.toJS('selectedTeamIndex'));
	},
	render: function() {
		const self = this;

		return (
			<div className="bEventTeams">
				{self._renderTeamEditHeader()}
				{self._renderPlayers()}
			</div>
		);
	}
});

module.exports = EventTeamsView;
