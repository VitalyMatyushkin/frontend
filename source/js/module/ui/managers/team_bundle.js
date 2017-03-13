// Main components
const	React		= require('react'),
		Immutable	= require('immutable'),
		Morearty	= require('morearty'),
		classNames	= require('classnames');

// Team bundle react components
const	TeamChooser	= require('./teamChooser'),
		TeamWrapper	= require('./team_wrapper');

// Helpers
const	TeamHelper	= require('module/ui/managers/helpers/team_helper');

// Style
const	TeamBundleStyle	= require('../../../../styles/ui/teams_manager/b_team_bundle.scss');

const TeamBundle = React.createClass({
	mixins: [Morearty.Mixin],
	TEAM_COUNT: 2,
	componentWillMount: function() {
		const self = this;

		self.initBinding();
		self.addListeners();
	},

	/** INIT FUNCTIONS **/
	initBinding: function() {
		const	self	= this;

		self.initTeamWrapperFiltersBinding();
	},
	initTeamWrapperFiltersBinding: function() {
		const	self	= this,
				rivals	= self.getBinding().rivals.toJS();

		rivals.forEach((rival, index) => self.initTeamWrapperFilterBinding(index, rival));
	},
	initTeamWrapperFilterBinding: function(rivalIndex, rival) {
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

	/** LISTENER FUNCTIONS **/
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
				`teamWrapper.${self.getAnotherRivalIndex(index)}.___teamManagerBinding.blackList`,
				descriptor.getCurrentValue()
			)
		});
	},

	/** HELPER FUNCTIONS **/
	getTeamChooserBindings: function() {
		const	binding				= this.getDefaultBinding(),
				teamChooserBindings	= [];

		for(let i = 0; i < this.TEAM_COUNT; i++) {
			teamChooserBindings.push({
				default:	binding.sub(`teamTable.${i}`),
				model:		this.getBinding().model,
				rival:		this.getBinding().rivals.sub(i)
			});
		}

		return teamChooserBindings;
	},
	getTeamWrapperBindings: function() {
		const	binding					= this.getDefaultBinding(),
				selectedRivalIndex		= binding.toJS('selectedRivalIndex'),
				tableWrapperBindings	= [];

		for(let i = 0; i < this.TEAM_COUNT; i++) {
			tableWrapperBindings.push({
				default				: binding.sub(`teamWrapper.${i}`),
				model				: this.getBinding().model,
				rival				: this.getBinding().rivals.sub(i),
				players				: binding.sub(`players.${i}`),
				otherTeamPlayers	: binding.sub(`players.${this.getAnotherRivalIndex(i)}`),
				error				: this.getBinding('error').sub(i)
			});
		}

		return tableWrapperBindings;
	},
	getClassNamesForTeamWrapper: function() {
		const	binding				= this.getDefaultBinding(),
				selectedRivalIndex	= binding.toJS('selectedRivalIndex'),
				_classNames			= [];

		for(let i = 0; i < this.TEAM_COUNT; i++) {
			_classNames.push(
				classNames({
						bWrapperTeamWrapper: true,
						mDisable: parseInt(selectedRivalIndex, 10) !== i
					}
				));
		}

		return _classNames;
	},
	getAnotherRivalIndex: function(rivalIndex) {

		return rivalIndex === 0 ? 1 : 0;
	},
	selectTeam: function(teamId, team) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	rivalIndex			= binding.toJS('selectedRivalIndex'),
				anotherRivalIndex	= self.getAnotherRivalIndex(rivalIndex);

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
	deselectTeam: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	rivalIndex			= binding.toJS('selectedRivalIndex'),
				anotherRivalIndex	= self.getAnotherRivalIndex(rivalIndex);

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

	/** HANDLE FUNCTIONS **/
	handleTeamClick: function(teamId, team) {
		const	binding				= this.getDefaultBinding(),
				rivalIndex			= binding.toJS('selectedRivalIndex'),
				prevSelectedTeamId	= binding.toJS(`teamWrapper.${rivalIndex}.selectedTeamId`);

		if(prevSelectedTeamId !== teamId) {
			this.selectTeam(teamId, team);
		}
	},
	handleIsSelectTeamLater: function(rivalIndex) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		self.deselectTeam();
		binding.set(`teamTable.${rivalIndex}.isSelectedTeam`, Immutable.fromJS(false));
	},

	/** RENDER FUNCTIONS **/
	renderTeamChoosers: function() {
		const	binding	= this.getDefaultBinding(),
				event	= this.getBinding('model').toJS();

		let teamChoosers = null;
		if(TeamHelper.isTeamSport(event)) {
			const selectedRivalIndex = binding.toJS('selectedRivalIndex');

			//TODO shitty way
			//one react element and many data bundles - that's what we need
			//Need to go TeamChooser on react state, delete morearty
			//problem is in my ugly realization of TeamChooser component
			//some data init on componentWillMount function
			//so we can't just send new data to TeamChooser in some point of TeamChooser lifecycle
			//and hope - everything will work good. NO!)
			//All fall down. Sorrrry, mate.
			teamChoosers = this.getTeamChooserBindings().map((binding, index) =>
				<TeamChooser	key				= { `team-chooser-${index}` }
								onTeamClick		= { this.handleTeamClick }
								onTeamDeselect	= { this.deselectTeam }
								binding			= { binding }
								isEnable		= { parseInt(selectedRivalIndex, 10) === index }
				/>
			);
		}

		return teamChoosers;
	},
	renderTeamWrapper: function() {
		const	binding				= this.getDefaultBinding(),
				selectedRivalIndex	= binding.toJS('selectedRivalIndex'),
				_classNames			= this.getClassNamesForTeamWrapper();

		return this.getTeamWrapperBindings().map((binding, index) => {
			return (
				<div	key			= { `team_wrapper_${index}` }
						className	= { _classNames[index] }
				>
					<TeamWrapper	binding					= { binding }
									handleIsSelectTeamLater	= { this.handleIsSelectTeamLater.bind(this, index) }
					/>
				</div>
			);
		});
	},
	render: function() {
		return (
			<div className="bTeamBundle">
				{ this.renderTeamChoosers() }
				{ this.renderTeamWrapper() }
			</div>
		);
	}
});

module.exports = TeamBundle;