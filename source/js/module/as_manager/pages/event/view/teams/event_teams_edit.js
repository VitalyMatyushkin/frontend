const	TeamManager			= require('./../../../../../ui/managers/team_manager/team_manager'),
		InvitesMixin 		= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		MoreartyHelper		= require('module/helpers/morearty_helper'),
		TeamHelper			= require('module/ui/managers/helpers/team_helper'),
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
		
		binding.set('initialPlayers', Immutable.fromJS(
			[
				binding.toJS('teamManagerBindings.0.teamStudents'),
				binding.toJS('teamManagerBindings.1.teamStudents')
			]
		));
	},
	initFilter: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	school	= self.getBinding('schoolInfo').toJS(),
				event	= self.getBinding('event').toJS();

		const filter = self._getPlayerChooserFilters(event, school);

		binding.atomically()
			.set('teamManagerBindings.0.filter', Immutable.fromJS(filter[0]))
			.set('teamManagerBindings.1.filter', Immutable.fromJS(filter[1]))
			.commit();
	},
	initSelectedTeamIndex: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();
		
		binding.set('selectedTeamIndex', Immutable.fromJS(0));
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
	_getPlayerChooserFilters: function(event, school) {
		const self = this;

		return event.teamsData.map(team => self._getPlayerChooserFilter(team, school));
	},
	_getOtherTeamIndex: function(order) {
		return order === 0 ? 1 : 0;
	},
	_getPlayerChooserFilter: function(team, school) {
		const	self = this;

		return {
			genders:	TeamHelper.getFilterGender(team.gender),
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
	handleTeamClick: function(order) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.set('selectedTeamIndex', Immutable.fromJS(order));
	},
	renderTeamChooser: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const event = self.getBinding('event').toJS();

		return event.teamsData.filter(team => TeamHelper.isTeamEnableForEdit(self.activeSchoolId, event, team)).map((team, index) => {
			const teamButtonClassName = classNames(
				{
					bEventTeams_teamButton:	true,
					mRightMargin:			true,
					mSelected:				binding.toJS('selectedTeamIndex') === index
				}
			);

			return (
				<button	className={teamButtonClassName}
						onClick={self.handleTeamClick.bind(self, index)}
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
				{self.renderTeamChooser()}
			</div>
		);
	},
	render: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return (
			<div className="bEventTeams">
				{self._renderTeamEditHeader()}
				{
					binding.toJS('teamManagerBindings').map((_, index) => {
						const teamWrapperClassName = classNames({
							bEventTeams_TeamWrapper:	true,
							mDisabled:					binding.toJS('selectedTeamIndex') === index
						});

						return (
							<div className={teamWrapperClassName}>
								<TeamManager binding={binding.sub(`teamManagerBindings.${index}`)}/>
							</div>
						);
					})
				}
			</div>
		);
	}
});

module.exports = EventTeamsView;
