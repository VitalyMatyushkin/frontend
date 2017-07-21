// Main components
const	React			= require('react'),
		Immutable		= require('immutable'),
		Morearty		= require('morearty'),
		classNames		= require('classnames');

// Team bundle react components
const	TeamChooser		= require('./teamChooser'),
		TeamWrapper		= require('./team_wrapper');

// Helpers
const	EventHelper		= require('module/helpers/eventHelper'),
		TeamHelper		= require('module/ui/managers/helpers/team_helper');

// Style
const	TeamBundleStyle	= require('../../../../styles/ui/teams_manager/b_team_bundle.scss');

const TeamBundle = React.createClass({
	mixins: [Morearty.Mixin],
	listeners: [],
	componentWillMount: function() {
		const self = this;

		self.initBinding();
		self.addListeners();
	},
	componentWillUnmount: function() {
		this.listeners.forEach(listener => this.getDefaultBinding().removeListener(listener));

		this.getDefaultBinding().clear();
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

		this.addRivalsCountListener();
	},
	addTeamPlayersListenerByTeamIndex: function(binding, index) {
		// if players were change
		// add players from one team to blacklist of other team
		const listener = binding.sub(`teamWrapper.${index}.___teamManagerBinding.teamStudents`).addListener(descriptor => {
			const anotherRivalIndexArray = this.getAnotherRivalIndexArray(index);

			// TODO check blacklist
			if(typeof descriptor.getCurrentValue() !== 'undefined') {
				anotherRivalIndexArray.forEach(index => {
					const blackList = binding.toJS(`teamWrapper.${index}.___teamManagerBinding.blackList`);

					binding.set(
						`teamWrapper.${index}.___teamManagerBinding.blackList`,
						Immutable.fromJS(
							blackList.concat(
								descriptor.getCurrentValue().toJS()
							)
						)
					);
				});
			}
		});

		this.listeners.push(listener);
	},
	/**
	 * Function adds listener for teamWrapper count
	 * That listener do some init operations for new team wrapper
	 */
	addRivalsCountListener: function() {
		const binding = this.getDefaultBinding();

		const listener = binding.sub(`rivalsCount`).addListener(descriptor => {
			const	currentRivalsCount	= descriptor.getCurrentValue(),
					prevRivalsCount		= descriptor.getPreviousValue();

			if(currentRivalsCount > prevRivalsCount) {
				const	rivals				= this.getBinding().rivals.toJS(),
						// rivals and team wrappers are connected
						// rival by index N corresponds to team wrapper by index N
						teamWrapperIndex	= currentRivalsCount - 1;

				this.initTeamWrapperFilterBinding(teamWrapperIndex, rivals[teamWrapperIndex]);
				this.addTeamPlayersListenerByTeamIndex(binding, teamWrapperIndex);
			}
		});

		this.listeners.push(listener);
	},
	/** HELPER FUNCTIONS **/
	getTeamChooserBindings: function() {
		const	binding			= this.getDefaultBinding();

		const	event			= this.getBinding().model,
				teamWrappers	= binding.toJS(`teamWrapper`);

		return teamWrappers.map((tw, index) => {
			let currentRivalBinding = this.getRivalBindingByTeamWrapperAndTeamWrapperIndex(event, tw, index);

			return ({
				default:	binding.sub(`teamTable.${index}`),
				model:		event,
				rival:		currentRivalBinding
			});
		});
	},
	getTeamWrapperBindings: function() {
		const	binding			= this.getDefaultBinding();

		const	event			= this.getBinding().model,
				teamWrappers	= binding.toJS(`teamWrapper`);

		return teamWrappers.map((tw, index) => {
			let currentRivalBinding = this.getRivalBindingByTeamWrapperAndTeamWrapperIndex(event, tw);

			const errorIndex = this.getBinding('error').toJS().findIndex(e => e.rivalId === tw.rivalId);

			return {
				default	: binding.sub(`teamWrapper.${index}`),
				model	: this.getBinding().model,
				rival	: currentRivalBinding,
				players	: binding.sub(`players.${index}`),
				error	: this.getBinding('error').sub(errorIndex)
			};
		});
	},
	getRivalBindingByTeamWrapperAndTeamWrapperIndex: function(event, teamWrapper) {
		const rivals = this.getBinding().rivals.toJS();

		return rivals.find(rival => rival.id === teamWrapper.rivalIndex);
	},
	getClassNamesForTeamWrapper: function() {
		const	binding			= this.getDefaultBinding(),
				selectedRival	= this.getBinding().rivals.toJS()[ binding.toJS('selectedRivalIndex') ];

		const teamWrappers = binding.toJS(`teamWrapper`);

		return teamWrappers.map(tw => {
			return classNames({
					bWrapperTeamWrapper:	true,
					mDisable:				tw.rivalId !== selectedRival.id
				}
			);
		});
	},
	getAllPlayers: function() {
		const	binding		= this.getDefaultBinding(),
				teamWrapper	= binding.toJS('teamWrapper');

		return teamWrapper.map(tw => tw.___teamManagerBinding.teamStudents);
	},
	getAnotherTeamPlayersByRivalIndex: function(rivalIndex) {
		const players = this.getAllPlayers();

		players.splice(rivalIndex, 1);

		let anotherPlayers = [];
		players.forEach(playersArray => {
			anotherPlayers = anotherPlayers.concat(playersArray);
		});

		return anotherPlayers;
	},
	getAnotherRivalIndexArray: function(rivalIndex) {
		const rivals = this.getBinding().rivals.toJS();

		return rivals
			.map((rival, rivalIndex) => rivalIndex)
			.filter(number => number !== rivalIndex);
	},
	/**
	 * Function adds teamId to black list of other rivals.
	 * @param teamTable
	 * @param currentRivalIndex
	 * @param blackListTeamId
	 * @returns {*}
	 */
	addTeamIdToOtherRivalsBlackList: function(teamTable, currentRivalIndex, blackListTeamId) {
		const anotherRivalIndexArray = this.getAnotherRivalIndexArray(currentRivalIndex);

		anotherRivalIndexArray.forEach(index => teamTable[index].teamIdBlackList.push(blackListTeamId));
	},
	/**
	 * Function removes teamId from black list of other rivals.
	 * @param teamTable
	 * @param currentRivalIndex
	 * @param blackListTeamId
	 */
	removeTeamIdToOtherRivalsBlackList: function(teamTable, currentRivalIndex, blackListTeamId) {
		const anotherRivalIndexArray = this.getAnotherRivalIndexArray(currentRivalIndex);

		anotherRivalIndexArray.forEach(index => {
			const teamIdIndex = teamTable[index].teamIdBlackList.find(id => id === blackListTeamId);

			teamTable[index].teamIdBlackList.splice(teamIdIndex, 1);
		});
	},
	selectTeam: function(teamId, team) {
		const	binding		= this.getDefaultBinding(),
				teamWrapper	= binding.toJS('teamWrapper'),
				teamTable	= binding.toJS('teamTable'),
				rivalIndex	= binding.toJS('selectedRivalIndex');

		teamWrapper[rivalIndex].selectedTeamId		= teamId;
		teamWrapper[rivalIndex].teamType			= team.teamType;
		teamWrapper[rivalIndex].selectedTeam		= team;
		teamWrapper[rivalIndex].prevTeamName		= team.name;
		teamWrapper[rivalIndex].teamName.name		= team.name;
		teamWrapper[rivalIndex].teamName.prevName	= team.name;
		teamTable[rivalIndex].selectedTeamId		= teamId;
		this.addTeamIdToOtherRivalsBlackList(teamTable, rivalIndex, teamId);

		binding
			.atomically()
			.set('teamWrapper',	Immutable.fromJS(teamWrapper))
			.set('teamTable',	Immutable.fromJS(teamTable))
			.commit();
	},
	deselectTeam: function() {
		const	binding		= this.getDefaultBinding(),
				teamWrapper	= binding.toJS('teamWrapper'),
				teamTable	= binding.toJS('teamTable'),
				rivalIndex	= binding.toJS('selectedRivalIndex'),
				teamId		= String(teamWrapper[rivalIndex].selectedTeamId);

		teamWrapper[rivalIndex].selectedTeamId		= undefined;
		teamWrapper[rivalIndex].teamType			= undefined;
		teamWrapper[rivalIndex].selectedTeam		= undefined;
		teamWrapper[rivalIndex].prevTeamName		= undefined;
		teamWrapper[rivalIndex].teamName.name		= undefined;
		teamTable[rivalIndex].selectedTeamId		= undefined;
		this.removeTeamIdToOtherRivalsBlackList(teamTable, rivalIndex, teamId);

		binding
			.atomically()
			.set('teamWrapper',	Immutable.fromJS(teamWrapper))
			.set('teamTable',	Immutable.fromJS(teamTable))
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
		const _classNames = this.getClassNamesForTeamWrapper();

		return this.getTeamWrapperBindings().map((binding, index) => {
			const rivalId = binding.default.toJS('rivalId');

			return (
				<div
					key			= { `team_wrapper_${index}` }
					className	= { _classNames[index] }
				>
					<TeamWrapper
						key						= { rivalId }
						binding					= { binding }
						otherTeamPlayers		= { this.getAnotherTeamPlayersByRivalIndex(index) }
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