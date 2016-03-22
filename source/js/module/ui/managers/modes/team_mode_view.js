const	React				= require('react'),
		TeamChooser			= require('./../teamChooser'),
		TeamWrapper			= require('./team_wrapper'),
		If					= require('module/ui/if/if'),
		Immutable			= require('immutable'),
		MoreartyHelper		= require('module/helpers/morearty_helper');

const TeamModeView = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		const	self	= this;

		self._initBinding();
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
				binding	= self.getDefaultBinding(),
				model	= self.getBinding('model').toJS();

		binding.set(`teamWrapper.${rivalIndex}.filter`, Immutable.fromJS({
			gender:		model.gender,
			houseId:	rival.houseId,
			schoolId:	MoreartyHelper.getActiveSchoolId(self),
			forms:		self._getFilteredAgesBySchoolForms(
							model.ages,
							self.getBinding('schoolInfo').toJS().forms
						)
		}));
	},
	/**
	 * Get school forms filtered by age
	 * @param ages
	 * @returns {*}
	 * @private
	 */
	_getFilteredAgesBySchoolForms: function(ages, schoolForms) {
		return schoolForms.filter((form) => {
			return	ages.indexOf(parseInt(form.age)) !== -1 ||
				ages.indexOf(String(form.age)) !== -1;
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
		let anotherRivalIndex = 0;
		if(rivalIndex == 0) {
			anotherRivalIndex = 1;
		}

		return anotherRivalIndex;
	},
	_selectTeam: function(teamId, team) {
		const self = this,
			binding = self.getDefaultBinding(),
			rivalIndex = binding.toJS('selectedRivalIndex'),
			anotherRivalIndex = self._getAnotherRivalIndex(rivalIndex);

		binding
			.atomically()
			.set(
				`teamWrapper.${rivalIndex}.selectedTeamId`,
				Immutable.fromJS(teamId)
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
		const self = this,
			binding = self.getDefaultBinding(),
			selectedRivalIndex = binding.toJS('selectedRivalIndex'),
			teamTableBinding = {
				default: binding.sub(`teamTable.${selectedRivalIndex}`),
				model: self.getBinding().model,
				rival: self.getBinding().rivals.sub(selectedRivalIndex)
			};

		return (
			<div>
				<If condition={selectedRivalIndex == 0}>
					<TeamChooser onTeamClick={self._onTeamClick} onTeamDeselect={self._deselectTeam} binding={teamTableBinding}/>
				</If>
				<If condition={selectedRivalIndex == 1}>
					<TeamChooser onTeamClick={self._onTeamClick} onTeamDeselect={self._deselectTeam} binding={teamTableBinding}/>
				</If>
			</div>
		);
	},
	_renderTeamWrapper: function() {
		const self = this,
			binding = self.getDefaultBinding(),
			selectedRivalIndex = binding.toJS('selectedRivalIndex'),
			tableWrapperBinding = {
				default:	binding.sub(`teamWrapper.${selectedRivalIndex}`),
				model:		self.getBinding().model,
				rival:		self.getBinding().rivals.sub(selectedRivalIndex)
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
	render: function() {
		const self = this;

		return (
			<div className="eManager_teamModeViewContainer">
				{self._renderTeamChooser()}
				{self._renderTeamWrapper()}
			</div>
		);
	}
});

module.exports = TeamModeView;