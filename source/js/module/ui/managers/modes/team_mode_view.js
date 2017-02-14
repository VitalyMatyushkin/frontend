const	React				= require('react'),
		TeamChooser			= require('./../teamChooser'),
		TeamWrapper			= require('./team_wrapper'),
		classNames			= require('classnames'),
		TeamHelper			= require('module/ui/managers/helpers/team_helper'),
		If					= require('module/ui/if/if'),
		Immutable			= require('immutable'),
		Morearty            = require('morearty'),
		MoreartyHelper		= require('module/helpers/morearty_helper');

const TeamModeView = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		const	self	= this;

		self._initBinding();
		self.addListeners();
	},
	_initBinding: function() {
		const	self	= this;

		self._initTeamWrapperFiltersBinding();
	},
	_initTeamWrapperFiltersBinding: function() {
		const	self	= this,
				rivals	= self.getBinding().rivals.toJS();

		rivals.forEach((rival, index) => self._initTeamWrapperFilterBinding(index, rival));
	},
	_initTeamWrapperFilterBinding: function(rivalIndex, rival) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	school	= self.getBinding('schoolInfo').toJS(),
				model	= self.getBinding('model').toJS(),
				gender	= TeamHelper.getFilterGender(model.gender),
				ages	= model.ages,
				houseId	= TeamHelper.getEventType(model) === 'houses' ? rival.id : undefined;

		binding.set(
			`teamWrapper.${rivalIndex}.___teamManagerBinding.filter`,
			Immutable.fromJS(
				TeamHelper.getTeamManagerSearchFilter(
					school,
					ages,
					gender,
					houseId
				)
			)
		);
	},
	addListeners: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const teamWrappers = binding.toJS('teamWrapper');
		teamWrappers.forEach((_, index) => self.addTeamPlayersListenerByTeamIndex(binding, index));
	},
	addTeamPlayersListenerByTeamIndex: function(binding, index) {
		const self = this;

		// if players were change
		// add players from one team to blacklist of other team
		binding.sub(`teamWrapper.${index}.___teamManagerBinding.teamStudents`).addListener(descriptor => {
			binding.set(
				`teamWrapper.${self._getAnotherRivalIndex(index)}.___teamManagerBinding.blackList`,
				descriptor.getCurrentValue()
			)
		});
	},
	/**
	 * Handler for click on team in team table
	 * @param teamId
	 * @private
	 */
	_onTeamClick: function(teamId, team) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	rivalIndex			= binding.toJS('selectedRivalIndex'),
				prevSelectedTeamId	= binding.toJS(`teamWrapper.${rivalIndex}.selectedTeamId`);

		if(prevSelectedTeamId !== teamId) {
			self._selectTeam(teamId, team);
		}
	},
	_getAnotherRivalIndex: function(rivalIndex) {

		return rivalIndex === 0 ? 1 : 0;
	},
	_selectTeam: function(teamId, team) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	rivalIndex			= binding.toJS('selectedRivalIndex'),
				anotherRivalIndex	= self._getAnotherRivalIndex(rivalIndex);

		binding
			.atomically()
			.set(
				`teamWrapper.${rivalIndex}.selectedTeamId`,
				Immutable.fromJS(teamId)
			)
			.set(
				`teamWrapper.${rivalIndex}.teamType`,
				Immutable.fromJS(team.teamType)
			)
			.set(
				`teamWrapper.${rivalIndex}.selectedTeam`,
				Immutable.fromJS(team)
			)
			.set(
				`teamWrapper.${rivalIndex}.prevTeamName`,
				Immutable.fromJS(team.name)
			)
			.set(
				`teamWrapper.${rivalIndex}.teamName.name`,
				Immutable.fromJS(team.name)
			)
			.set(
				`teamWrapper.${rivalIndex}.teamName.prevName`,
				Immutable.fromJS(team.name)
			)
			.set(
				`teamTable.${rivalIndex}.selectedTeamId`,
				Immutable.fromJS(teamId)
			)
			.set(
				`teamTable.${anotherRivalIndex}.exceptionTeamId`,
				Immutable.fromJS(teamId)
			)
			.commit();
	},
	_deselectTeam: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	rivalIndex			= binding.toJS('selectedRivalIndex'),
				anotherRivalIndex	= self._getAnotherRivalIndex(rivalIndex);

		binding
			.atomically()
			.set(
				`teamWrapper.${rivalIndex}.selectedTeamId`,
				Immutable.fromJS(undefined)
			)
			.set(
				`teamWrapper.${rivalIndex}.teamType`,
				Immutable.fromJS(undefined)
			)
			.set(
				`teamWrapper.${rivalIndex}.selectedTeam`,
				Immutable.fromJS(undefined)
			)
			.set(
				`teamWrapper.${rivalIndex}.teamName.name`,
				Immutable.fromJS(undefined)
			)
			.set(
				`teamWrapper.${rivalIndex}.prevTeamName`,
				Immutable.fromJS(undefined)
			)
			.set(
				`teamTable.${rivalIndex}.selectedTeamId`,
				Immutable.fromJS(undefined)
			)
			.set(
				`teamTable.${anotherRivalIndex}.exceptionTeamId`,
				Immutable.fromJS(undefined)
			)
			.commit();
	},
	_renderTeamWrapper: function() {
		const	self				= this,
				binding				= self.getDefaultBinding(),
				selectedRivalIndex	= binding.toJS('selectedRivalIndex'),
				tableWrapperBindings= [
										{
											default				: binding.sub(`teamWrapper.${0}`),
											model				: self.getBinding().model,
											rival				: self.getBinding().rivals.sub(0),
											players				: binding.sub(`players.${0}`),
											otherTeamPlayers	: binding.sub(`players.${self._getAnotherRivalIndex(0)}`),
											error				: self.getBinding('error').sub(0)
										},{
											default:			binding.sub(`teamWrapper.${1}`),
											model:				self.getBinding().model,
											rival:				self.getBinding().rivals.sub(1),
											players:			binding.sub(`players.${1}`),
											otherTeamPlayers:	binding.sub(`players.${self._getAnotherRivalIndex(1)}`),
											error				: self.getBinding('error').sub(1)
										}];

		const _classNames = [
			classNames({
				bWrapperTeamWrapper: true,
				mDisable: parseInt(selectedRivalIndex, 10) !== 0
			}),
			classNames({
				bWrapperTeamWrapper: true,
				mDisable: parseInt(selectedRivalIndex, 10) !== 1
			})
		];
		return (
			<div>
				<div	key			= "team_wrapper_1"
						className	= { _classNames[0] }
				>
					<TeamWrapper	binding					= {tableWrapperBindings[0] }
									handleIsSelectTeamLater	= {self.handleIsSelectTeamLater.bind(self, 0) }
					/>
				</div>
				<div	key			= "team_wrapper_2"
						className	= { _classNames[1] }
				>
					<TeamWrapper	binding					= { tableWrapperBindings[1] }
									handleIsSelectTeamLater	= { self.handleIsSelectTeamLater.bind(self, 1) }
					/>
				</div>
			</div>
		);
	},
	handleIsSelectTeamLater: function(rivalIndex) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		self._deselectTeam();
		binding.set(`teamTable.${rivalIndex}.isSelectedTeam`, Immutable.fromJS(false));
	},
	_renderErrorBox: function() {
		const	selectedRivalIndex	= this.getDefaultBinding().toJS('selectedRivalIndex'),
				_errorText			= this.getBinding('error').toJS(selectedRivalIndex).text;

		// it doesn't show team name warning
		return (
			<div className="eTeam_errorBox">
				{_errorText !== 'Please enter team name' ? _errorText : ''}
			</div>
		);
	},
	render: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const event = self.getBinding('model').toJS();

		const teamModeViewClass = classNames({
			eManager_teamModeViewContainer: true,
			mIndividuals: TeamHelper.isNonTeamSport(event)
		});

		let teamChoosers = null;
		if(TeamHelper.isTeamSport(event)) {
			const	selectedRivalIndex	= binding.toJS('selectedRivalIndex'),
					teamTableBindings	= [
						{
							default:	binding.sub(`teamTable.${0}`),
							model:		self.getBinding().model,
							rival:		self.getBinding().rivals.sub(0)
						},
						{
							default:	binding.sub(`teamTable.${1}`),
							model:		self.getBinding().model,
							rival:		self.getBinding().rivals.sub(1)
						}
					];

			//TODO shitty way
			//one react element and many data bundles - that's what we need
			//Need to go TeamChooser on react state, delete morearty
			//problem is in my ugly realization of TeamChooser component
			//some data init on componentWillMount function
			//so we can't just send new data to TeamChooser in some point of TeamChooser lifecycle and
			//and hope - everything will work good.
			//NO!) All fall down, man. Sorrrry.
			teamChoosers = teamTableBindings.map((binding, index) =>
				<TeamChooser	key				= { `team-chooser-${index}` }
								onTeamClick		= { self._onTeamClick }
								onTeamDeselect	= { self._deselectTeam }
								binding			= { teamTableBindings[index] }
								isEnable		= { parseInt(selectedRivalIndex, 10) === index }
				/>
			);
		}

		return (
			<div className={teamModeViewClass}>
				{ teamChoosers }
				{ self._renderTeamWrapper() }
			</div>
		);
	}
});

module.exports = TeamModeView;