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
				houseId	= model.type === 'houses' ? rival.id : undefined;

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
		const self = this,
			binding = self.getDefaultBinding(),
			rivalIndex = binding.toJS('selectedRivalIndex'),
			prevSelectedTeamId = binding.toJS(`teamWrapper.${rivalIndex}.selectedTeamId`);

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
		const self = this,
			binding = self.getDefaultBinding(),
			rivalIndex = binding.toJS('selectedRivalIndex'),
			anotherRivalIndex = self._getAnotherRivalIndex(rivalIndex);

		binding
			.atomically()
			.set(
				`teamWrapper.${rivalIndex}.selectedTeamId`,
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
	_renderTeamChooser: function() {
		const	self = this,
				binding = self.getDefaultBinding();

		const event = self.getBinding('model').toJS();

		switch (true) {
			case TeamHelper.isTeamSport(event):
				const	selectedRivalIndex	= binding.toJS('selectedRivalIndex'),
						teamTableBinding	= {
							default:	binding.sub(`teamTable.${selectedRivalIndex}`),
							model:		self.getBinding().model,
							rival:		self.getBinding().rivals.sub(selectedRivalIndex)
						};

				//TODO shitty way
				//one react element and many data bundles - that's what we need
				//Need to go TeamChooser on react state, delete morearty
				//problem is in my ugly realization of TeamChooser component
				//some data init on componentWillMount function
				//so we can't just send new data to TeamChooser in some point of TeamChooser lifecycle and
				//and hope - everything will work good.
				//NO!) All fall down, man. Sorrrry.
				if(selectedRivalIndex == 0) {
					return <TeamChooser onTeamClick={self._onTeamClick} onTeamDeselect={self._deselectTeam} binding={teamTableBinding}/>;
				} else if(selectedRivalIndex == 1) {
					return <TeamChooser onTeamClick={self._onTeamClick} onTeamDeselect={self._deselectTeam} binding={teamTableBinding}/>;
				}
			default:
				return null;
		}
	},
	_renderTeamWrapper: function() {
		const	self				= this,
				binding				= self.getDefaultBinding(),
				selectedRivalIndex	= binding.toJS('selectedRivalIndex'),
				tableWrapperBinding	= {
										default:			binding.sub(`teamWrapper.${selectedRivalIndex}`),
										model:				self.getBinding().model,
										rival:				self.getBinding().rivals.sub(selectedRivalIndex),
										players:			binding.sub(`players.${selectedRivalIndex}`),
										otherTeamPlayers:	binding.sub(`players.${self._getAnotherRivalIndex(selectedRivalIndex)}`)
									};

		//TODO delete IF
		//TODO merge two team wrappers tp one team wrapper
		return (
			<div>
				<If condition={selectedRivalIndex == 0}>
					<TeamWrapper binding={tableWrapperBinding}/>
				</If>
				<If condition={selectedRivalIndex == 1}>
					<TeamWrapper binding={tableWrapperBinding}/>
				</If>
			</div>
		);
	},
	_renderErrorBox: function() {
		const	self				= this,
				binding				= self.getDefaultBinding(),
				selectedRivalIndex	= binding.toJS('selectedRivalIndex'),
				errorText			= self.getBinding().error.toJS(selectedRivalIndex).text;

		return (
			<div className="eTeam_errorBox">
				{errorText}
			</div>
		);
	},
	render: function() {
		const self = this;

		const event = self.getBinding('model').toJS();

		const teamModeViewClass = classNames({
			eManager_teamModeViewContainer: true,
			mIndividuals: TeamHelper.isNonTeamSport(event)
		});

		return (
			<div className={teamModeViewClass}>
				{self._renderTeamChooser()}
				{self._renderErrorBox()}
				{self._renderTeamWrapper()}
			</div>
		);
	}
});

module.exports = TeamModeView;